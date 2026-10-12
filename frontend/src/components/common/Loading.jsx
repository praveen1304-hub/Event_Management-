import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Loading CampusPulse data...', fullHeight = false }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      padding: '3rem 1.5rem',
      minHeight: fullHeight ? '60vh' : 'auto',
      color: '#64748b'
    }}>
      <Loader2 size={32} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
