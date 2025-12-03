import { collectResources } from './networkCollector';
import { loadLists, matchUrl } from './filterEngine';
import { scanDom } from './domScanner';
import { BenchmarkResult } from '../utils/types';
import { clampScore, normalizeUrl } from '../utils/format';

export const benchmarkPage = async (url: string): Promise<BenchmarkResult> => {
  const normalizedUrl = normalizeUrl(url);
  const notes: string[] = [];

  await loadLists();

  const resources = await collectResources(normalizedUrl);
  const matchedRequests = resources.filter((resource) => matchUrl(resource));

  let docReport = { adElements: 0, details: [] as Array<{ selector: string; reason: string }> };

  try {
    const res = await fetch(normalizedUrl, { mode: 'cors' });
    if (res.ok) {
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      docReport = scanDom(doc);
    } else {
      notes.push('Unable to fetch DOM snapshot (CORS)');
    }
  } catch (error) {
    console.warn('DOM fetch error', error);
    notes.push('DOM snapshot blocked by CORS; DOM heuristics are limited.');
  }

  const resourcesTotal = resources.length;
  const adRequestsDetected = matchedRequests.length;
  const domAdsDetected = docReport.adElements;

  const ARD = clampScore((adRequestsDetected / Math.max(resourcesTotal, 1)) * 100);
  const ADE = clampScore(Math.min(100, domAdsDetected * 12));
  const BPS = clampScore(ARD * 0.6 + ADE * 0.4);

  const samples = {
    matchedRequests: matchedRequests.slice(0, 50),
    domElements: docReport.details.slice(0, 50),
  };

  if (resourcesTotal === 0) {
    notes.push('No resources were detected. The site may block embedding or require user interaction.');
  }

  return {
    url: normalizedUrl,
    timestamp: Date.now(),
    resourcesTotal,
    adRequestsDetected,
    domAdsDetected,
    scores: { ARD, ADE, BPS },
    samples,
    notes,
  };
};
