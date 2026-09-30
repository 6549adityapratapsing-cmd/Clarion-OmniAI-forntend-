import React from 'react';
import { ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';
import { DecisionStatus } from '../types';

export const TrustBadge: React.FC<{ decision?: DecisionStatus; className?: string }> = ({
  decision,
  className = ''
}) => {
  if (!decision) return null;

  switch (decision) {
    case 'AUTO_APPROVE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 badge-glow-emerald ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Auto-Approved (Verified)
        </span>
      );

    case 'REVIEW_REQUIRED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/40 badge-glow-amber ${className}`}
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          Human Review Required
        </span>
      );

    case 'REJECT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40 badge-glow-rose ${className}`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Exception / Rejected
        </span>
      );

    default:
      return null;
  }
};
