import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon = <Inbox size={42} style={{ color: '#94a3b8' }} />,
  title = 'No Records Found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel = null,
  onAction = null
}) => {
  return (
    <div style={{
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      border: '1px dashed #cbd5e1',
      borderRadius: 'var(--radius-lg)',
      margin: '1rem 0'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {icon}
      </div>
      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', marginBottom: actionLabel ? '1.25rem' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
