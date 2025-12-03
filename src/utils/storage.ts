import { HISTORY_KEY } from '../data/constants';
import { BenchmarkResult } from './types';

export const persistHistory = (entries: BenchmarkResult[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 20)));
};

export const readHistory = (): BenchmarkResult[] => {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BenchmarkResult[];
  } catch (error) {
    console.error('Failed to parse history', error);
    return [];
  }
};

export const addToHistory = (entry: BenchmarkResult): BenchmarkResult[] => {
  const history = readHistory();
  const next = [entry, ...history.filter((item) => item.url !== entry.url)];
  persistHistory(next);
  return next;
};
