import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Shield, LogOut, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '../store/authStore';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <Link
          to="/documents"
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span>Search documents, suppliers, reference numbers...</span>
          <kbd className="ml-auto font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Ctrl+K</kbd>
        </Link>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* System Health Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>IDP Engine Online</span>
        </div>

        {/* Demo Scenarios Quick Link */}
        <Link
          to="/upload"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Scenarios</span>
        </Link>

        {/* User profile & Logout */}
        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-xs">
                {user.fullName.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">{user.fullName}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1 py-0.2 bg-slate-800 rounded">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors ml-1"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
