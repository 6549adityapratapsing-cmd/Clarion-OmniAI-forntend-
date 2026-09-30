import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useToast } from '../components/Toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const createMockSession = (enteredEmail: string) => {
    const cleanEmail = enteredEmail.trim() || 'reviewer@clarion.ai';
    const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName =
      namePart.length > 1
        ? namePart.replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Demo Reviewer';

    let userRole: 'ADMIN' | 'REVIEWER' | 'VIEWER' = 'ADMIN';
    if (cleanEmail.toLowerCase().includes('viewer')) {
      userRole = 'VIEWER';
    } else if (
      cleanEmail.toLowerCase().includes('reviewer') ||
      cleanEmail.toLowerCase().includes('student')
    ) {
      userRole = 'REVIEWER';
    }

    const mockUser = {
      id: `demo-${Date.now()}`,
      email: cleanEmail,
      fullName: formattedName,
      role: userRole,
      department: 'Procurement & Finance Audit',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const mockToken = `demo-token-${Date.now()}`;

    return { user: mockUser, token: mockToken };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const enteredEmail = email.trim() || 'demo.user@clarion.ai';
    const enteredPassword = password.trim() || 'Password@123';

    try {
      // Attempt backend login with 2-second timeout failsafe
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      const result = await api.auth.login(
        { email: enteredEmail, password: enteredPassword },
        { signal: controller.signal }
      ).catch(() => null);

      clearTimeout(timer);

      if (result && result.user && result.token) {
        login(result.user, result.token);
        toast.success('Signed in successfully', `Welcome back, ${result.user.fullName}`);
      } else {
        // Immediate client-side demo bypass
        const mock = createMockSession(enteredEmail);
        login(mock.user, mock.token);
        toast.success('Demo Mode Active', `Logged in as ${mock.user.fullName} (${mock.user.role})`);
      }
      navigate('/dashboard');
    } catch {
      // Guaranteed zero-failure login
      const mock = createMockSession(enteredEmail);
      login(mock.user, mock.token);
      toast.success('Demo Mode Active', `Logged in as ${mock.user.fullName}`);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemo = (role: 'ADMIN' | 'REVIEWER' | 'VIEWER' = 'ADMIN') => {
    const demoEmail = role === 'ADMIN' ? 'admin@clarion.ai' : role === 'REVIEWER' ? 'reviewer@clarion.ai' : 'viewer@clarion.ai';
    const mock = createMockSession(demoEmail);
    mock.user.role = role;
    login(mock.user, mock.token);
    toast.success('Instant Demo Access', `Entering dashboard as ${mock.user.fullName} [${role}]`);
    navigate('/dashboard');
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-0.5 shadow-xl shadow-emerald-500/20 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Clarion <span className="text-emerald-400 font-mono">OmniAI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Explainable Intelligent Document Processing & Business Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reviewer@clarion.ai"
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Platform
            </Button>

            <button
              type="button"
              onClick={() => handleInstantDemo('ADMIN')}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-500/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant Demo / Guest Access (1-Click)</span>
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              1-Click Demo Profiles (Password: Password@123)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@clarion.ai')}
                className="px-2 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300 text-xs font-medium text-center transition-colors"
              >
                <span className="block font-bold text-white text-[11px]">Admin</span>
                <span className="text-[10px] text-slate-500">Alex W.</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('reviewer@clarion.ai')}
                className="px-2 py-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 hover:border-emerald-700 text-emerald-300 text-xs font-medium text-center transition-colors"
              >
                <span className="block font-bold text-emerald-400 text-[11px]">Reviewer</span>
                <span className="text-[10px] text-emerald-500/80">Sarah J.</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('viewer@clarion.ai')}
                className="px-2 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300 text-xs font-medium text-center transition-colors"
              >
                <span className="block font-bold text-white text-[11px]">Viewer</span>
                <span className="text-[10px] text-slate-500">Michael C.</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Need an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
