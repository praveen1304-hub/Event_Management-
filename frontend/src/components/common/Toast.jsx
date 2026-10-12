import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({
  message,
  type = 'success', // 'success', 'error', 'warning', 'info'
  onClose
}) => {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--danger)' }} />,
    warning: <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />,
    info: <Info size={18} style={{ color: 'var(--info)' }} />
  };

  const borderMap = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--info)'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      backgroundColor: '#ffffff',
      border: '1px solid var(--border-light)',
      borderLeft: `4px solid ${borderMap[type] || borderMap.info}`,
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '420px',
      animation: 'slideInRight 0.25s ease'
    }}>
      {iconMap[type] || iconMap.info}
      <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 500, flex: 1 }}>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
