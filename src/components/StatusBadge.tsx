import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { DocumentStatus } from '../types';

export const StatusBadge: React.FC<{ status: DocumentStatus; className?: string }> = ({
  status,
  className = ''
}) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Approved
        </span>
      );

    case 'REVIEW_REQUIRED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 badge-glow-amber ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Review Required
        </span>
      );

    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Rejected
        </span>
      );

    case 'PROCESSING':
    case 'OCR_COMPLETED':
    case 'CLASSIFIED':
    case 'EXTRACTED':
    case 'VALIDATED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 ${className}`}
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
          Processing
        </span>
      );

    case 'PROCESSING_FAILED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/40 text-rose-400 border border-rose-800 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Failed
        </span>
      );

    case 'QUEUED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Queued
        </span>
      );
  }
};
