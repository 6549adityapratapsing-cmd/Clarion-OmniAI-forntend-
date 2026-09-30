import React from 'react';

export const ConfidenceBadge: React.FC<{
  confidence: number; // 0.0 to 1.0 or 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ confidence, showLabel = true, size = 'sm', className = '' }) => {
  const norm = confidence > 1 ? confidence : Math.round(confidence * 100);

  let colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-400';

  if (norm < 75) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-400';
  } else if (norm < 90) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-mono border ${padding} ${colorClasses} ${className}`}
      title={`AI Confidence Score: ${norm}%`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0 animate-pulse`} />
      {norm}%{showLabel && <span className="font-sans text-[10px] text-slate-400 uppercase tracking-wider">conf</span>}
    </span>
  );
};
