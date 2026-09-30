import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { ValidationResult } from '../types';

export const ValidationAlert: React.FC<{
  result: ValidationResult | null;
  onSelectIssue?: (fieldName?: string) => void;
  className?: string;
}> = ({ result, onSelectIssue, className = '' }) => {
  if (!result) return null;

  const isPass = result.status === 'PASS';
  const isWarning = result.status === 'WARNING';
  const isFail = result.status === 'FAIL';

  return (
    <div
      className={`rounded-xl border p-4 backdrop-blur-md transition-all ${
        isPass
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : isWarning
          ? 'bg-amber-950/25 border-amber-500/40'
          : 'bg-rose-950/25 border-rose-500/40'
      } ${className}`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          {isPass && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {isFail && <AlertCircle className="w-5 h-5 text-rose-400" />}
          <div>
            <h4 className="text-sm font-semibold text-slate-100">
              {isPass && 'Deterministic Business Validation Passed'}
              {isWarning && 'Deterministic Validation Warnings'}
              {isFail && 'Validation Critical Discrepancies'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {result.rulePassCount} passed • {result.ruleWarningCount} warnings • {result.ruleFailureCount} failures
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase ${
            isPass
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : isWarning
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {result.status}
        </span>
      </div>

      {result.issues && result.issues.length > 0 && (
        <div className="mt-3 space-y-2">
          {result.issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue && onSelectIssue(issue.fieldName)}
              className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      issue.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : issue.severity === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : issue.severity === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {issue.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">{issue.issueCode}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{issue.message}</p>
              {issue.suggestedFix && (
                <div className="mt-2 text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded px-2 py-1">
                  💡 <span className="font-semibold">Suggested Fix:</span> {issue.suggestedFix}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
