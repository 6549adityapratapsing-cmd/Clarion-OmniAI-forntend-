import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, ShieldCheck, AlertTriangle, ArrowRight, IndianRupee } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton, EmptyState } from '../components/EmptyState';

export const Suppliers: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['suppliers-list'],
    queryFn: () => api.suppliers.list()
  });

  const suppliers = data?.suppliers || [];

  if (isLoading) return <LoadingSkeleton lines={6} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-emerald-400" />
          Enterprise Supplier Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Vendor profiles, spend concentration, tax compliance status, and document reconciliation history.
        </p>
      </div>

      {suppliers.length === 0 ? (
        <EmptyState title="No suppliers found" description="Suppliers are dynamically registered as documents are processed." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suppliers.map((sup) => (
            <div
              key={sup.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    {sup.name.charAt(0)}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      sup.riskScore < 3.0
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : sup.riskScore < 6.0
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    Risk: {sup.riskScore} / 10
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-100 mt-3 group-hover:text-emerald-400 transition-colors">
                  {sup.name}
                </h3>
                <p className="text-xs font-mono text-emerald-400 font-medium mt-1">
                  GSTIN: {sup.taxIdentifier || 'Pending Verification'}
                </p>
                <p className="text-xs text-slate-400 mt-2 truncate">{sup.address || 'Address on file'}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Total Spend</span>
                    <span className="text-sm font-bold text-slate-100">₹{sup.totalSpend.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Documents</span>
                    <span className="text-sm font-bold text-slate-100">{sup.documentCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
                <Link
                  to={`/suppliers/${sup.id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
