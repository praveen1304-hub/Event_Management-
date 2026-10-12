import React from 'react';
import { Shield } from 'lucide-react';

export const AdminHeader = ({
  title = 'Admin Governance',
  subtitle = 'Central college event platform management, statistics, and host oversight.',
  action = null
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.75rem',
      paddingBottom: '1.25rem',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <span className="badge badge-category" style={{ color: '#1e40af', backgroundColor: '#eff6ff' }}>
            <Shield size={12} /> Superadmin
          </span>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          {subtitle}
        </p>
      </div>

      {action && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {action}
        </div>
      )}
    </div>
  );
};
