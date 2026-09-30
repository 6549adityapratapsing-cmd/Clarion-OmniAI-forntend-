import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  UploadCloud,
  CheckSquare,
  Bot
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const MobileBottomNav: React.FC = () => {
  const { data: metrics } = useQuery({
    queryKey: ['metrics-badge-bottom'],
    queryFn: () => api.insights.getMetrics(),
    refetchInterval: 10000
  });

  const pendingReviewCount = metrics?.kpis?.pendingReviewDocuments || 0;

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/documents', label: 'Documents', icon: <Files className="w-5 h-5" /> },
    {
      to: '/upload',
      label: 'Ingest',
      icon: <UploadCloud className="w-5 h-5" />,
      highlight: true
    },
    {
      to: '/review-queue',
      label: 'Review',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined
    },
    { to: '/assistant', label: 'AI Chat', icon: <Bot className="w-5 h-5" /> }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around safe-area-bottom select-none shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 relative min-w-[56px] ${
              isActive
                ? item.highlight
                  ? 'text-emerald-400 font-semibold'
                  : 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {item.highlight ? (
                <div
                  className={`p-1.5 -mt-4 rounded-xl border transition-all shadow-lg ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
                  }`}
                >
                  {item.icon}
                </div>
              ) : (
                <div className="relative">
                  <div className={`transition-transform ${isActive ? 'scale-110' : ''}`}>{item.icon}</div>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-slate-950 border border-slate-900 leading-tight">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <span className={`text-[10px] mt-0.5 tracking-tight font-medium ${item.highlight ? 'mt-1' : ''}`}>
                {item.label}
              </span>
              {isActive && !item.highlight && (
                <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
