import React from 'react';
import { AlertCircle, FileX, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, description, actionText, onAction, icon, className = '' }) => {
  return (
    <div className={`p-10 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400 mb-3 shadow-inner">
        {icon || <FileX className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 4,
  className = ''
}) => {
  return (
    <div className={`space-y-3 p-4 animate-pulse ${className}`}>
      <div className="h-6 bg-slate-800 rounded-lg w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-800/60 rounded-md w-full" />
      ))}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while communicating with the server.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`p-8 text-center rounded-2xl border border-rose-900/40 bg-rose-950/20 ${className}`}>
      <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
      <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
      <p className="text-xs text-rose-300/80 mt-1 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button size="sm" variant="secondary" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
};
