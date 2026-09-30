import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Files,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  UploadCloud,
  CheckSquare
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { TrustBadge } from '../components/TrustBadge';
import { LoadingSkeleton } from '../components/EmptyState';

const STATUS_COLORS: Record<string, string> = {
  APPROVED: '#10B981',
  REVIEW_REQUIRED: '#F59E0B',
  REJECTED: '#EF4444',
  PROCESSING: '#3B82F6',
  QUEUED: '#64748B'
};

export const Dashboard: React.FC = () => {
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => api.insights.getMetrics(),
    refetchInterval: 10000
  });

  const { data: docList, isLoading: isDocsLoading } = useQuery({
    queryKey: ['recent-documents'],
    queryFn: () => api.documents.list({ limit: 5 }),
    refetchInterval: 10000
  });

  if (isMetricsLoading || isDocsLoading) {
    return <LoadingSkeleton lines={8} />;
  }

  const kpis = metrics?.kpis;
  const charts = metrics?.charts;
  const recentDocs = docList?.documents || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              Autonomous Document Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1.5">
            Accounts Payable & Procurement Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live explainable extraction, deterministic business checks, purchase order 2-way/3-way matching, and human-in-the-loop review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/review-queue"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <span>Review Queue ({kpis?.pendingReviewDocuments || 0})</span>
          </Link>
          <Link
            to="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Document</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Documents"
          value={kpis?.totalDocuments || 0}
          subtitle="Processed in system"
          icon={<Files className="w-5 h-5 text-blue-400" />}
          glowColor="blue"
        />
        <MetricCard
          title="Approved (Trusted)"
          value={kpis?.approvedDocuments || 0}
          subtitle={`${metrics?.trustHealth.autoApprovalRate || 70}% pass rate`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          glowColor="emerald"
        />
        <MetricCard
          title="Pending Review"
          value={kpis?.pendingReviewDocuments || 0}
          subtitle="Requires human signoff"
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          glowColor="amber"
        />
        <MetricCard
          title="Total Invoiced Spend"
          value={`₹${((kpis?.totalInvoiceSpend || 0) / 1000).toFixed(1)}k`}
          subtitle="Indian AP Ledger"
          icon={<IndianRupee className="w-5 h-5 text-emerald-400" />}
          glowColor="emerald"
        />
        <MetricCard
          title="Risk & Mismatches"
          value={(kpis?.duplicateCount || 0) + (kpis?.poMismatchCount || 0)}
          subtitle={`${kpis?.poMismatchCount || 0} PO variances, ${kpis?.duplicateCount || 0} dups`}
          icon={<ShieldAlert className="w-5 h-5 text-rose-400" />}
          glowColor="rose"
        />
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Trends Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Procurement Spend Volume (INR)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical invoice transaction values</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified Ledger
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts?.spendTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#10B981" stop-opacity={0.35} />
                    <stop offset="95%" stop-color="#10B981" stop-opacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spend']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing Status Donut Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Document Processing Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">Lifecycle state machine breakdown</p>
          </div>

          <div className="h-52 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.documentsByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(charts?.documentsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#64748B'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-slate-800">
            {(charts?.documentsByStatus || []).map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] || '#64748B' }} />
                <span className="text-slate-400 text-[11px] truncate">{s.name}: {s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spend by Supplier & Recent Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Suppliers Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Supplier Spend Concentration</h3>
              <p className="text-xs text-slate-400 mt-0.5">Top vendors by total billing value</p>
            </div>
            <Link to="/suppliers" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts?.supplierSpend || []}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `₹${v / 1000}k`} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Total Spend']}
                />
                <Bar dataKey="spend" fill="#06B6D4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Ingested Documents Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Recent Processing Ingestion Queue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest documents analyzed through the explainability engine</p>
            </div>
            <Link to="/documents" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              All Documents <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Document Title</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-medium text-slate-100">
                      <Link to={`/documents/${doc.id}`} className="hover:text-emerald-400 transition-colors block truncate max-w-xs">
                        {doc.title}
                      </Link>
                      <div className="text-[10px] text-slate-500 font-mono">{doc.referenceNumber || 'Pending Ref'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {doc.documentType || 'PROCESSING'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300 truncate max-w-[140px]">
                      {doc.supplierName || '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-100">
                      ₹{(doc.totalAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <ConfidenceBadge confidence={doc.overallConfidence || 0.95} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-sans text-xs transition-colors"
                      >
                        Inspect
                      </Link>
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
