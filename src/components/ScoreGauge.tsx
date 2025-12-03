import { cn } from '../utils/cn';

type Props = {
  value: number;
  label: string;
  highlight?: string;
};

const ScoreGauge = ({ value, label, highlight }: Props) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 75 ? 'stroke-emerald-400' : value > 50 ? 'stroke-amber-300' : 'stroke-rose-400';

  return (
    <div className="glass-panel p-4 flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            className="stroke-white/10"
            strokeWidth={12}
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            strokeDasharray={circumference}
            strokeDashoffset={0}
          />
          <circle
            className={cn('transition-all duration-500 ease-out', color)}
            strokeWidth={12}
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-4xl font-bold gradient-text">{value}</p>
          <p className="text-sm uppercase tracking-wide text-slate-400">{label}</p>
        </div>
      </div>
      {highlight && <p className="text-sm text-center text-slate-300 light:text-slate-600">{highlight}</p>}
    </div>
  );
};

export default ScoreGauge;
