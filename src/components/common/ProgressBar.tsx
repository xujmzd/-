import React from 'react';

interface ProgressBarProps {
  progress: number;
  status?: 'pending' | 'in_production' | 'completed' | 'overdue' | string;
  showText?: boolean;
  size?: 'sm' | 'md';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status,
  showText = true,
  size = 'md',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  let barGradient = 'bg-gradient-to-r from-[#2563EB] to-[#0284C7]';
  let textColor = 'text-slate-800';

  if (status === 'completed' || clampedProgress === 100) {
    barGradient = 'bg-gradient-to-r from-[#059669] to-[#10B981]';
    textColor = 'text-[#059669]';
  } else if (status === 'overdue') {
    barGradient = 'bg-gradient-to-r from-[#B91C1C] to-[#EF4444]';
    textColor = 'text-[#DC2626] font-bold';
  } else if (status === 'pending') {
    barGradient = 'bg-slate-400';
    textColor = 'text-slate-600';
  }

  const heightClass = size === 'sm' ? 'h-2' : 'h-2.5';

  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className={`flex-1 bg-slate-200/80 rounded-xs overflow-hidden border border-slate-300/80 ${heightClass}`}>
        <div
          className={`${heightClass} ${barGradient} transition-all duration-300 rounded-xs relative`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showText && (
        <span className={`text-xs font-mono font-semibold ${textColor} min-w-[3.4rem] text-right tabular-nums`}>
          {clampedProgress.toFixed(1)}%
        </span>
      )}
    </div>
  );
};
