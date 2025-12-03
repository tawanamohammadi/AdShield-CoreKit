import { useState } from 'react';
import { benchmarkPage } from '../services/benchmarkService';
import { BenchmarkResult } from '../utils/types';
import ResultCard from './ResultCard';

const ComparePanel = ({ baseline }: { baseline?: BenchmarkResult }) => {
  const [url, setUrl] = useState('');
  const [comparison, setComparison] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const result = await benchmarkPage(url);
      setComparison(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compare two sites</h3>
        {loading && <span className="text-xs text-sky-300">Running…</span>}
      </div>
      <form className="flex flex-col md:flex-row gap-2" onSubmit={runCompare}>
        <input
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400 light:bg-white light:border-slate-200 light:text-slate-800"
          placeholder="https://example.org"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-sky-400 px-4 py-2 font-semibold shadow hover:opacity-90"
          disabled={loading}
        >
          Run compare
        </button>
      </form>
      {baseline && comparison && (
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-slate-400">Baseline</p>
            <ResultCard
              title={baseline.url}
              value={`BPS ${baseline.scores.BPS}`}
              description={`${baseline.adRequestsDetected} ad requests • ${baseline.domAdsDetected} DOM hits`}
            />
          </div>
          <div>
            <p className="text-sm text-slate-400">Comparison</p>
            <ResultCard
              title={comparison.url}
              value={`BPS ${comparison.scores.BPS}`}
              description={`${comparison.adRequestsDetected} ad requests • ${comparison.domAdsDetected} DOM hits`}
              accent="from-emerald-400 to-sky-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePanel;
