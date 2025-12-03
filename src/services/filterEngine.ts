import {
  EASYLIST_URL,
  EASYPRIVACY_URL,
  LIST_CACHE_KEY,
  LIST_CACHE_TTL,
} from '../data/constants';

export type FilterMetadata = {
  lastUpdated: number | null;
  mode: 'cliqz' | 'light';
};

type StoredList = {
  easyList: string;
  easyPrivacy: string;
  ts: number;
};

let engine: any = null;
let lastUpdated: number | null = null;
let mode: 'cliqz' | 'light' = 'light';

const readCache = (): StoredList | null => {
  const raw = localStorage.getItem(LIST_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredList;
  } catch (error) {
    console.error('Unable to parse list cache', error);
    return null;
  }
};

const writeCache = (payload: StoredList) => {
  localStorage.setItem(LIST_CACHE_KEY, JSON.stringify(payload));
};

const buildLightEngine = (lists: string[]) => {
  const rules: RegExp[] = [];
  const toRegex = (line: string) => {
    let pattern = line
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\^/g, '[^a-zA-Z0-9_]');
    if (line.startsWith('||')) {
      pattern = `https?:\\/\\/([a-z0-9-]+\\.)*${pattern.slice(2)}`;
    }
    return new RegExp(pattern, 'i');
  };

  lists
    .join('\n')
    .split('\n')
    .filter((line) => line && !line.startsWith('!') && !line.startsWith('['))
    .forEach((line) => {
      try {
        rules.push(toRegex(line));
      } catch (error) {
        // ignore malformed
      }
    });

  engine = {
    match: ({ url }: { url: string }) => {
      const matched = rules.find((rule) => rule.test(url));
      return matched ? { match: true, filter: { rawLine: matched.source } } : { match: false };
    },
  };
  mode = 'light';
};

const tryLoadCliqz = async (lists: string[]) => {
  try {
    const mod = await import(
      /* @vite-ignore */ 'https://esm.sh/@cliqz/adblocker-web@1.27.2?bundle'
    );
    const FiltersEngine = mod.FiltersEngine || mod.default?.FiltersEngine || mod.default;
    if (FiltersEngine) {
      engine = await FiltersEngine.fromLists(fetch, lists);
      mode = 'cliqz';
    }
  } catch (error) {
    console.warn('Falling back to lightweight matcher', error);
    buildLightEngine(lists);
  }
};

export const loadLists = async (force = false) => {
  if (engine && !force) return;

  const cached = readCache();
  const now = Date.now();
  if (cached && now - cached.ts < LIST_CACHE_TTL && !force) {
    await tryLoadCliqz([cached.easyList, cached.easyPrivacy]);
    lastUpdated = cached.ts;
    return;
  }

  const [easyList, easyPrivacy] = await Promise.all([
    fetch(EASYLIST_URL).then((r) => r.text()),
    fetch(EASYPRIVACY_URL).then((r) => r.text()),
  ]);

  await tryLoadCliqz([easyList, easyPrivacy]);
  lastUpdated = now;
  writeCache({ easyList, easyPrivacy, ts: now });
};

export const matchUrl = (url: string, type = 'resource'): boolean => {
  if (!engine) return false;
  const matched: any = engine.match({ url, type });
  return Boolean(matched?.match || matched?.matches);
};

export const explainMatch = (
  url: string,
  type = 'resource',
): { matched: boolean; rule?: string } => {
  if (!engine) return { matched: false };
  const result: any = engine.match({ url, type });
  const matched = Boolean(result?.match || result?.matches);
  const rule = result?.filter?.rawLine || result?.filter?.text || result?.filters?.[0]?.rawLine;
  return { matched, rule };
};

export const getFilterMetadata = (): FilterMetadata => ({
  lastUpdated,
  mode,
});
