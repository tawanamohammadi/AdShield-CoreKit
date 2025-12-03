import { useEffect, useState } from 'react';
import { ActivityIcon, TargetIcon, WifiIcon } from '../components/Icons';
import ThemeToggle from '../components/ThemeToggle';
import ProgressSteps from '../components/ProgressSteps';
import ResultCard from '../components/ResultCard';
import ScoreGauge from '../components/ScoreGauge';
import SampleList from '../components/SampleList';
import HistoryList from '../components/HistoryList';
import ComparePanel from '../components/ComparePanel';
import VisitorCard from '../components/VisitorCard';
import { benchmarkPage } from '../services/benchmarkService';
import { getVisitorInfo } from '../services/geoService';
import { addToHistory, readHistory } from '../utils/storage';
import { BenchmarkResult, VisitorInfo } from '../utils/types';
import { getFilterMetadata, loadLists } from '../services/filterEngine';

const App = () => {
  const [url, setUrl] = useState('https://example.com');
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [history, setHistory] = useState<BenchmarkResult[]>(readHistory());
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo>();
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    getVisitorInfo().then(setVisitorInfo).catch(console.error);
    loadLists().catch(console.error);
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setStatus('Initializing filter engine');
    setProgressStep(1);
    try {
      await loadLists(true);
      setProgressStep(2);
      setStatus('Collecting network + DOM signals');
      const resultData = await benchmarkPage(url);
      setProgressStep(4);
      setStatus('Done');
      setResult(resultData);
      setHistory(addToHistory(resultData));
    } catch (error) {
      console.error(error);
      setStatus('Failed to scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase text-slate-400">AdShield CoreKit</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            Ad & Tracker Benchmark <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl light:text-slate-600 mt-2">
            Run client-side audits powered by EasyList/EasyPrivacy. Measure network level ad calls, DOM signals, and your connection hygiene—all without leaving the browser.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://github.com/tawanamohammadi/AdShield-CoreKit"
            className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/10 light:border-slate-200 light:hover:bg-slate-100"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <section className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase text-slate-400">Quick scan</p>
            <h2 className="text-2xl font-semibold">Benchmark a URL</h2>
            <p className="text-sm text-slate-400">Supports HTTPS targets; works client-side so some sites may restrict data collection.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Last filter update</p>
            <p className="font-mono text-sm">{getFilterMetadata().lastUpdated ? new Date(getFilterMetadata().lastUpdated!).toLocaleString() : 'Loading…'}</p>
          </div>
        </div>
        <form className="flex flex-col md:flex-row gap-2" onSubmit={handleScan}>
          <input
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-sky-400 light:bg-white light:border-slate-200 light:text-slate-800"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://news.ycombinator.com"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:translate-y-[-1px] transition"
            disabled={loading}
          >
            {loading ? 'Scanning…' : 'Run benchmark'}
          </button>
        </form>
        <p className="text-xs text-slate-400">{status}</p>
        <ProgressSteps current={progressStep} done={!loading && !!result} />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="card-grid">
            <ResultCard
              title="Network requests"
              value={result ? `${result.adRequestsDetected}/${result.resourcesTotal} flagged` : '—'}
              description="Ad/Tracker calls seen in collected resources"
              icon={<ActivityIcon />}
            />
            <ResultCard
              title="DOM ad signals"
              value={result ? result.domAdsDetected : '—'}
              description="Elements resembling ad slots"
              accent="from-amber-400 to-orange-500"
              icon={<TargetIcon />}
            />
            <ResultCard
              title="VPN / Proxy"
              value={visitorInfo ? (visitorInfo.vpnLikely ? 'Likely' : 'Unlikely') : 'Detecting…'}
              description={visitorInfo?.vpnReason}
              accent="from-emerald-400 to-teal-500"
              icon={<WifiIcon />}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <ScoreGauge value={result ? result.scores.BPS : 0} label="BPS" highlight="Blended Protection Score" />
            <ScoreGauge value={result ? result.scores.ARD : 0} label="ARD" highlight="Ad Request Density" />
            <ScoreGauge value={result ? result.scores.ADE : 0} label="ADE" highlight="Ad DOM Exposure" />
          </div>

          <SampleList result={result ?? undefined} />
          <ComparePanel baseline={result ?? undefined} />
        </div>

        <div className="space-y-4">
          <VisitorCard info={visitorInfo} />
          <HistoryList entries={history} onSelect={(entry) => setResult(entry)} />
          {result && (
            <div className="glass-panel p-4 text-sm space-y-2">
              <h3 className="text-lg font-semibold">Notes & limitations</h3>
              <ul className="list-disc list-inside text-slate-300 light:text-slate-600 space-y-1">
                <li>Runs entirely in your browser; some sites block cross-origin embedding.</li>
                <li>Resource capture uses Performance API + DOM scraping; not as deep as a browser extension.</li>
                <li>Adblock rules: EasyList + EasyPrivacy (cached locally for 24h).</li>
                {result.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
