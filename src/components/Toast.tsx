// ============================================================
// JIOS — Toast Notification Component
// ============================================================

import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { Toast, ToastType } from '../types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const toastStyles: Record<ToastType, { bg: string; icon: JSX.Element; border: string }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  },
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const style = toastStyles[toast.type];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-medium
        ${style.bg} ${style.border} animate-slide-up`}
      role="alert"
    >
      {style.icon}
      <p className="text-sm font-medium text-navy flex-1 pt-0.5">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-navy-300 hover:text-navy transition-colors flex-shrink-0 -mt-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
