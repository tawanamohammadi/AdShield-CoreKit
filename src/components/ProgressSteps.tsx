import { cn } from '../utils/cn';
import { LoaderIcon } from './Icons';

const steps = ['Loading filter lists', 'Collecting resources', 'Scanning DOM', 'Computing score'];

type Props = { current: number; done: boolean };

const ProgressSteps = ({ current, done }: Props) => (
  <div className="glass-panel p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">Live progress</h3>
      {!done && <LoaderIcon />}
    </div>
    <ol className="space-y-2 text-sm">
      {steps.map((step, index) => (
        <li
          key={step}
          className={cn('flex items-center gap-2', index < current ? 'text-emerald-400' : 'text-slate-300')}
        >
          <span
            className={cn(
              'h-5 w-5 rounded-full border flex items-center justify-center text-[10px] font-bold',
              index < current ? 'bg-emerald-500/20 border-emerald-400' : 'border-white/20',
            )}
          >
            {index < current ? '✓' : index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  </div>
);

export default ProgressSteps;
