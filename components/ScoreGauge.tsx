import React, { useState, useEffect, useRef } from 'react';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const size = 200;
  const strokeWidth = 20;
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

  useEffect(() => {
    let animationFrameId: number;
    const start = 0;
    const end = score;
    const duration = 1000;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const newScore = Math.floor(start + (end - start) * percentage);
      setDisplayScore(newScore);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayScore(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [score]);


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
          className={`transform -rotate-90 origin-center transition-stroke-dashoffset duration-1000 ease-out ${scoreColor}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: circumference }} // start from 0
          ref={circle => {
              if (circle) {
                  // Trigger transition on mount/update
                  setTimeout(() => circle.style.strokeDashoffset = `${scoreOffset}`, 10);
              }
          }}
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