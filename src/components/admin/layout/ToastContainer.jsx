import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="adm-toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`adm-toast ${toast.type || 'info'}`} role="status">
          <div className={`adm-toast-icon ${toast.type || 'info'}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {(!toast.type || toast.type === 'info') && <Info size={18} />}
          </div>
          <span className="adm-toast-msg">{toast.message}</span>
          <button 
            type="button" 
            className="adm-toast-close" 
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
