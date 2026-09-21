// ============================================================
// JIOS — LoadingState, EmptyState, ErrorState components
// ============================================================

import { AlertCircle, CalendarX, Loader2 } from 'lucide-react';

// ── Loading ──────────────────────────────────────────────────

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
      <Loader2 className="w-8 h-8 text-caramel animate-spin" />
      <p className="text-navy-300 text-sm font-medium">{message}</p>
    </div>
  );
}

// ── Empty ────────────────────────────────────────────────────

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'Nothing here yet',
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-cream-300 flex items-center justify-center">
        {icon || <CalendarX className="w-8 h-8 text-navy-300" />}
      </div>
      <div>
        <h3 className="font-serif text-lg text-navy mb-1">{title}</h3>
        {description && <p className="text-navy-300 text-sm max-w-xs mx-auto">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ── Error ────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load data. Please try again.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div>
        <h3 className="font-serif text-lg text-navy mb-1">{title}</h3>
        <p className="text-navy-300 text-sm max-w-xs mx-auto">{description}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary btn-sm mt-2">
          Try Again
        </button>
      )}
    </div>
  );
}
