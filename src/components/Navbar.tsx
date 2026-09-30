import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '../store/authStore';

export interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Hamburger Toggle & Mobile Brand Logo */}
      <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-md">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none"
            aria-label="Open navigation menu"
            title="Open navigation"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
        )}

        {/* Mobile Brand Title (visible only on mobile) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-tight text-white font-mono">
            Clarion<span className="text-emerald-400">OmniAI</span>
          </span>
        </div>

        {/* Search Input Trigger (desktop/tablet) */}
        <div className="hidden sm:flex items-center flex-1 max-w-md">
          <Link
            to="/documents"
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300 text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Search documents, suppliers...</span>
            <kbd className="ml-auto font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 shrink-0">
              Ctrl+K
            </kbd>
          </Link>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* System Health Status Indicator (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span>IDP Engine Online</span>
        </div>

        {/* Demo Scenarios Quick Link */}
        <Link
          to="/upload"
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Demo Scenarios</span>
          <span className="sm:hidden">Demo</span>
        </Link>

        {/* User profile & Logout */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0"
                title={`${user.fullName} (${user.role})`}
              >
                {user.fullName.charAt(0)}
              </div>
              <div className="hidden md:block text-left max-w-[130px]">
                <div className="text-xs font-semibold text-slate-200 leading-tight truncate">{user.fullName}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1 py-0.2 bg-slate-800 rounded">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
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
