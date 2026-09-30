import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, User as UserIcon, Building, ArrowRight, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useToast } from '../components/Toast';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('REVIEWER');
  const [department, setDepartment] = useState('Accounts Payable');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await api.auth.register({ email, password, fullName, role, department });
      login(result.user, result.token);
      toast.success('Registration Complete', `Welcome, ${result.user.fullName}`);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
      toast.error('Registration Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-blue-500 p-0.5 shadow-xl shadow-emerald-500/20 mx-auto">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Clarion Account</h1>
          <p className="text-xs text-slate-400">Join the explainable document intelligence workspace</p>
        </div>

        <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              required
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password (min 8 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { label: 'Reviewer', value: 'REVIEWER' },
                  { label: 'Admin', value: 'ADMIN' },
                  { label: 'Viewer', value: 'VIEWER' }
                ]}
              />

              <Input
                label="Department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Finance"
                leftIcon={<Building className="w-4 h-4" />}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register & Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
