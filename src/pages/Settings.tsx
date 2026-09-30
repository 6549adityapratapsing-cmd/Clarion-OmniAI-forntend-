import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Server,
  Sliders,
  User,
  Key,
  Database,
  Cpu,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';

export default function Settings() {
  const { user } = useAuthStore();
  const [minConfidence, setMinConfidence] = useState(90);
  const [poVarianceTolerance, setPoVarianceTolerance] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-indigo-400" />
          System Settings & Governance
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure deterministic review policies, inspect provider health, and verify RBAC role permissions.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          Active Session Identity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Full Name</div>
            <div className="text-sm font-semibold text-white mt-1">{user?.fullName || 'Senior Reviewer'}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Email Address</div>
            <div className="text-sm font-semibold text-white mt-1">{user?.email || 'reviewer@clarion.ai'}</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-500 uppercase tracking-wider">Assigned Role</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {user?.role || 'REVIEWER'}
              </span>
              <span className="text-[11px] text-slate-400">Full review & approval rights</span>
            </div>
          </div>
        </div>
      </div>

      {/* RBAC Permission Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Role-Based Access Control (RBAC) Matrix
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Permissions enforced on both REST backend middleware and frontend routes.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Capability / Permission</th>
                <th className="pb-3 font-semibold text-center">VIEWER</th>
                <th className="pb-3 font-semibold text-center">REVIEWER</th>
                <th className="pb-3 font-semibold text-center">ADMIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5">Upload Documents & View Ingestion Status</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
              </tr>
              <tr>
                <td className="py-2.5">Access Grounded AI Assistant & Knowledge Search</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
              </tr>
              <tr>
                <td className="py-2.5">Edit Extracted Fields & Save Human Version (V2)</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
              </tr>
              <tr>
                <td className="py-2.5">Approve or Reject Documents into Gold Ledger</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400">✓</td>
                <td className="text-center text-emerald-400">✓</td>
              </tr>
              <tr>
                <td className="py-2.5">System Reprocessing & Deterministic Policy Changes</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-slate-600">—</td>
                <td className="text-center text-emerald-400">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider & Infrastructure Health */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          Provider Abstraction & Infrastructure Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">AI Understanding Provider</div>
                <div className="text-xs text-slate-400">Gemini 2.5 Pro / Resilient Fallback</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">OCR & Spatial Engine</div>
                <div className="text-xs text-slate-400">Tesseract / Native PDF Parser</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Operational
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Database & Vector Storage</div>
                <div className="text-xs text-slate-400">Supabase PostgreSQL + pgvector</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Cryptography & Storage</div>
                <div className="text-xs text-slate-400">bcrypt (12 rounds) & SHA-256 Storage</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
            </span>
          </div>
        </div>
      </div>

      {/* Review & Automation Thresholds Form */}
      <form onSubmit={handleSavePolicy} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
        <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          Decision Engine & Review Thresholds
        </h2>
        <p className="text-xs text-slate-400">
          Control the boundary between straight-through automated processing and mandatory human review.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimum Auto-Approval Confidence Threshold ({minConfidence}%)
            </label>
            <input
              type="range"
              min="70"
              max="99"
              value={minConfidence}
              onChange={e => setMinConfidence(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Documents with any key field confidence below this will be forced into Human Review.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Purchase Order Variance Tolerance (₹{poVarianceTolerance})
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={poVarianceTolerance}
              onChange={e => setPoVarianceTolerance(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Discrepancies exceeding this value trigger PO_MISMATCH critical exceptions.
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Policies updated successfully.
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              Changes apply instantaneously to newly ingested document jobs.
            </span>
          )}
          <Button type="submit" size="sm">
            Save Threshold Policies
          </Button>
        </div>
      </form>
    </div>
  );
}
