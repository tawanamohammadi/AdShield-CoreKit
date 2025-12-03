import { cn } from '../utils/cn';
import { ReactNode } from 'react';

const ResultCard = ({
  title,
  value,
  description,
  accent = 'from-indigo-500 to-sky-400',
  icon,
}: {
  title: string;
  value: ReactNode;
  description?: string;
  accent?: string;
  icon?: ReactNode;
}) => (
  <div className="glass-panel p-4 relative overflow-hidden">
    <div className={cn('absolute inset-0 bg-gradient-to-br opacity-20', accent)} aria-hidden />
    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        {description && <p className="text-sm text-slate-300 light:text-slate-600 mt-1">{description}</p>}
      </div>
      {icon && <div className="text-slate-200 light:text-slate-700">{icon}</div>}
    </div>
  </div>
);

export default ResultCard;
