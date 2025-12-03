import { normalizeUrl } from '../utils/format';

const collectFromDocument = (doc: Document, baseUrl: string, bucket: Set<string>) => {
  const selectors = ['img', 'script', 'iframe', 'link', 'video', 'audio', 'source'];
  selectors.forEach((selector) => {
    doc.querySelectorAll(selector).forEach((node) => {
      const element = node as HTMLElement;
      const attribute = (element as HTMLImageElement).src ? 'src' : 'href';
      const raw = (element as any)[attribute] || element.getAttribute(attribute);
      if (raw) {
        try {
          const resolved = new URL(raw, baseUrl).href;
          bucket.add(resolved);
        } catch (error) {
          console.warn('Unable to resolve resource url', raw, error);
        }
      }
    });
  });
};

export const collectResources = async (targetUrl: string): Promise<string[]> => {
  const resources = new Set<string>();
  const normalizedUrl = normalizeUrl(targetUrl);
  let observer: PerformanceObserver | null = null;

  try {
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('name' in entry && typeof entry.name === 'string') {
          resources.add(entry.name);
        }
      }
    });
    observer.observe({ type: 'resource', buffered: true });
  } catch (error) {
    console.warn('PerformanceObserver unavailable', error);
  }

  // First attempt: direct fetch (CORS permitted)
  try {
    const response = await fetch(normalizedUrl, { mode: 'cors' });
    if (response.ok) {
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      collectFromDocument(doc, normalizedUrl, resources);
    }
  } catch (error) {
    console.warn('Direct fetch failed; will attempt iframe sandbox', error);
  }

  // Fallback: sandboxed iframe to capture resource timings
  const iframe = document.createElement('iframe');
  iframe.src = normalizedUrl;
  iframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
  iframe.loading = 'eager';
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => resolve(), 8000);
    iframe.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    iframe.onerror = () => {
      clearTimeout(timeout);
      resolve();
    };
  });

  try {
    if (iframe.contentDocument) {
      collectFromDocument(iframe.contentDocument, normalizedUrl, resources);
    }
  } catch (error) {
    console.warn('Unable to read iframe DOM (expected for cross-origin)', error);
  }

  if (observer) {
    try {
      observer.takeRecords().forEach((entry) => resources.add(entry.name));
      observer.disconnect();
    } catch (error) {
      console.warn('Observer cleanup issue', error);
    }
  }

  iframe.remove();

  return Array.from(resources);
};
