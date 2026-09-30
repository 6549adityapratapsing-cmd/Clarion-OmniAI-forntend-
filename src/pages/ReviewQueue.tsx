import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { Button } from '../components/Button';
import { LoadingSkeleton, EmptyState } from '../components/EmptyState';

export const ReviewQueue: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['review-queue-docs'],
    queryFn: () => api.documents.list({ status: 'REVIEW_REQUIRED', limit: 50 }),
    refetchInterval: 8000
  });

  const docs = data?.documents || [];

  if (isLoading) return <LoadingSkeleton lines={6} />;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 shadow-xl">
        <div>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
            Human-in-the-Loop Gate
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white mt-1.5 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            Prioritized Review Queue ({docs.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Documents diverted to human review due to low extraction confidence, mathematical mismatches, purchase order variances, or duplicate detection flags.
          </p>
        </div>
      </div>

      {docs.length === 0 ? (
        <EmptyState
          title="Review Queue is Clean!"
          description="All incoming documents have been verified or auto-approved by the 3-Layer Decision Triad."
          actionText="Ingest Demo Scenario"
          onAction={() => window.location.assign('/upload')}
        />
      ) : (
        <div className="space-y-3">
          {docs.map((doc, idx) => (
            <div
              key={doc.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                  #{idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {doc.documentType}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                      {doc.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 font-mono">
                    Ref: <span className="text-slate-200 font-bold">{doc.referenceNumber || 'N/A'}</span> • Supplier:{' '}
                    <span className="text-slate-200">{doc.supplierName || 'Unassigned'}</span> • Total:{' '}
                    <span className="text-emerald-400 font-bold">₹{(doc.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </p>

                  {/* Flag Reason */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-300/90 pt-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{doc.decisionReason || 'Requires human verification.'}</span>
                  </div>
                </div>
              </div>

              {/* Confidence and Review CTA */}
              <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">AI Confidence</span>
                  <ConfidenceBadge confidence={doc.overallConfidence || 0.8} />
                </div>

                <Link to={`/review/${doc.id}`}>
                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-amber-500/20 border-amber-400/40"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Open Review Workspace
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
