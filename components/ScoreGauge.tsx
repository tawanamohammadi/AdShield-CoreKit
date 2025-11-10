
import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const size = 180;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const scoreOffset = ((100 - score) / 100) * circumference;

  const scoreColor =
    score > 85
      ? 'text-green-500'
      : score > 60
      ? 'text-yellow-500'
      : 'text-red-500';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          className="text-slate-200 dark:text-slate-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
        {/* Foreground score arc */}
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${scoreColor}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          strokeDashoffset={scoreOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${scoreColor}`}>
          {score}
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
