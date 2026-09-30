import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  glowColor?: 'emerald' | 'amber' | 'rose' | 'blue';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  glowColor = 'emerald',
  className = ''
}) => {
  const glowClasses = {
    emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    rose: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
    blue: 'hover:border-blue-500/40 hover:shadow-blue-500/10'
  };

  return (
    <div
      className={`glass-card p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl ${glowClasses[glowColor]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1 font-mono tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 shrink-0">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.value}
          </span>
          <span className="text-slate-500">vs last cycle</span>
        </div>
      )}
    </div>
  );
};
