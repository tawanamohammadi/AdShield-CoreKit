import { formatDateTime } from '../utils/format';
import { BenchmarkResult } from '../utils/types';

const HistoryList = ({
  entries,
  onSelect,
}: {
  entries: BenchmarkResult[];
  onSelect: (entry: BenchmarkResult) => void;
}) => (
  <div className="glass-panel p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">History</h3>
      <p className="text-xs text-slate-400">Stored locally</p>
    </div>
    {entries.length === 0 && <p className="text-sm text-slate-400">No scans yet.</p>}
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li
          key={`${entry.url}-${entry.timestamp}`}
          className="flex items-center justify-between rounded-lg border border-white/10 light:border-slate-200 px-3 py-2 hover:bg-white/5 light:hover:bg-slate-50 cursor-pointer"
          onClick={() => onSelect(entry)}
        >
          <div>
            <p className="font-medium">{entry.url}</p>
            <p className="text-xs text-slate-400">{formatDateTime(entry.timestamp)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">BPS {entry.scores.BPS}</p>
            <p className="text-xs text-slate-400">{entry.resourcesTotal} assets</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default HistoryList;
