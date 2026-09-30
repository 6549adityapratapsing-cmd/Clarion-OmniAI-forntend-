import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Files,
  UploadCloud,
  CheckSquare,
  Building2,
  TrendingUp,
  Bot,
  ShieldCheck,
  Settings,
  Sparkles,
  X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  // Query pending review count
  const { data: metrics } = useQuery({
    queryKey: ['metrics-badge'],
    queryFn: () => api.insights.getMetrics(),
    refetchInterval: 10000
  });

  const pendingReviewCount = metrics?.kpis?.pendingReviewDocuments || 0;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/documents', label: 'Documents', icon: <Files className="w-4 h-4" /> },
    { to: '/upload', label: 'Upload & Ingest', icon: <UploadCloud className="w-4 h-4" /> },
    {
      to: '/review-queue',
      label: 'Review Queue',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined
    },
    { to: '/suppliers', label: 'Suppliers', icon: <Building2 className="w-4 h-4" /> },
    { to: '/insights', label: 'Insights & Risk', icon: <TrendingUp className="w-4 h-4" /> },
    { to: '/assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { to: '/trust-dashboard', label: 'Trust & Health', icon: <ShieldCheck className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const NavContent = () => (
    <>
      {/* Brand Header */}
      <div className="h-16 px-5 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              Clarion <span className="text-emerald-400 font-mono">OmniAI</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">IDP Platform</p>
          </div>
        </div>

        {/* Close Button for Mobile Drawer */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => {
              if (onClose) onClose();
            }}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 shrink-0 safe-area-bottom">
        <div className="flex items-center justify-between font-mono">
          <span>Clarion Core v1.0</span>
          <span className="text-emerald-400">Online</span>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">Multi-device Responsive AP/IDP</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-800 bg-slate-950 flex-col shrink-0 select-none">
        <NavContent />
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Drawer Panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-950 border-r border-slate-800 flex flex-col shadow-2xl z-50 select-none animate-in slide-in-from-left duration-200">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
};
