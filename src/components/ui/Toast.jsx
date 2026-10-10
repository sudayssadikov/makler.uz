import React from 'react';
import { useToastStore } from '../../store/toastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import './Toast.css';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (!toasts.length) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="toast-icon-success" />;
      case 'error': return <AlertCircle size={18} className="toast-icon-error" />;
      case 'warning': return <AlertTriangle size={18} className="toast-icon-warning" />;
      default: return <Info size={18} className="toast-icon-info" />;
    }
  };

  return (
    <div className="neo-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`neo-toast neo-toast-${t.type}`}>
          <div className="neo-toast-left">
            {getIcon(t.type)}
            <span className="neo-toast-msg">{t.message}</span>
          </div>
          <button
            className="neo-toast-close"
            onClick={() => removeToast(t.id)}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};
