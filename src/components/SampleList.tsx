import { BenchmarkResult } from '../utils/types';

const SampleList = ({ result }: { result?: BenchmarkResult }) => {
  if (!result) return null;
  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold mb-2">Samples</h3>
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div>
          <p className="font-semibold mb-1">Matched requests</p>
          {result.samples.matchedRequests.length === 0 && <p className="text-slate-400">No ad patterns matched</p>}
          <ul className="space-y-1 max-h-44 overflow-auto">
            {result.samples.matchedRequests.map((url) => (
              <li key={url} className="truncate border-b border-white/5 pb-1 light:border-slate-200/70">
                {url}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-1">DOM ad candidates</p>
          {result.samples.domElements.length === 0 && <p className="text-slate-400">No DOM signals captured</p>}
          <ul className="space-y-1 max-h-44 overflow-auto">
            {result.samples.domElements.map((item, idx) => (
              <li key={`${item.selector}-${idx}`} className="border-b border-white/5 pb-1 light:border-slate-200/70">
                <span className="font-mono text-xs">{item.selector}</span>
                <p className="text-slate-400">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SampleList;
