import React, { useState, useEffect, useRef, useMemo } from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const size = 200;
  const strokeWidth = 20;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const [displayScore, setDisplayScore] = useState(0);
  const [dashOffset, setDashOffset] = useState(circumference);
  const previousScoreRef = useRef(0);

  const clampedScore = useMemo(() => {
    if (Number.isNaN(score)) {
      return 0;
    }
    return Math.min(100, Math.max(0, Math.round(score)));
  }, [score]);

  const scoreOffset = useMemo(
    () => ((100 - clampedScore) / 100) * circumference,
    [clampedScore, circumference],
  );

  const scoreColor =
    clampedScore > 85
      ? 'text-green-500'
      : clampedScore > 60
      ? 'text-yellow-500'
      : 'text-red-500';

  useEffect(() => {
    let animationFrameId: number;
    const start = previousScoreRef.current;
    const end = clampedScore;
    const duration = 900;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const newScore = Math.round(start + (end - start) * percentage);
      setDisplayScore(newScore);

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    previousScoreRef.current = end;

    return () => cancelAnimationFrame(animationFrameId);
  }, [clampedScore]);

  useEffect(() => {
    setDashOffset(circumference);
    const rafId = requestAnimationFrame(() => setDashOffset(scoreOffset));
    return () => cancelAnimationFrame(rafId);
  }, [circumference, scoreOffset]);

  return (
    <div
      className="relative drop-shadow-xl"
      style={{ width: size, height: size }}
    >
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
          className={`transform -rotate-90 origin-center transition-[stroke-dashoffset] duration-1000 ease-out ${scoreColor}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold tracking-tighter ${scoreColor}`}>
          {displayScore}
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 -mt-1">Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
