import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, ArrowLeft, Mail, Phone, MapPin, IndianRupee, Files } from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { LoadingSkeleton, ErrorState } from '../components/EmptyState';

export const SupplierDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['supplier-details', id],
    queryFn: () => api.suppliers.getById(id!),
    enabled: !!id
  });

  if (isLoading) return <LoadingSkeleton lines={8} />;
  if (error || !data) return <ErrorState message="Could not load supplier profile." />;

  const { supplier, documents } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/suppliers"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">{supplier.name}</h1>
          <p className="text-xs text-slate-400 font-mono">GSTIN: {supplier.taxIdentifier || 'Not Provided'}</p>
        </div>
      </div>

      {/* Supplier Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Vendor Overview
          </h3>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{supplier.email || 'billing@vendor.com'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{supplier.phone || '+91 22 2456 7890'}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{supplier.address || 'MIDC Industrial Area, Mumbai'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Total Spend</span>
              <span className="text-base font-bold text-emerald-400">₹{supplier.totalSpend.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Risk Score</span>
              <span className="text-base font-bold text-slate-200">{supplier.riskScore} / 10</span>
            </div>
          </div>
        </div>

        {/* Associated Documents */}
        <div className="md:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Files className="w-4 h-4 text-cyan-400" />
            Associated Business Documents ({documents.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-medium">
                      <Link to={`/documents/${doc.id}`} className="hover:text-emerald-400 text-slate-100 font-semibold">
                        {doc.title}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">{doc.documentType}</td>
                    <td className="py-2.5 px-3 text-slate-400">{doc.documentDate || '—'}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      ₹{(doc.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={doc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
