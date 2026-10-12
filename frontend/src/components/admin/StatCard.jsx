import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle = null,
  icon = null,
  trend = null,
  color = 'blue' // 'blue', 'green', 'amber', 'purple', 'slate'
}) => {
  const colorStyles = {
    blue: { bg: '#eff6ff', border: '#bfdbfe', iconColor: '#2563eb' },
    green: { bg: '#ecfdf5', border: '#a7f3d0', iconColor: '#059669' },
    amber: { bg: '#fffbeb', border: '#fde68a', iconColor: '#d97706' },
    purple: { bg: '#faf5ff', border: '#e9d5ff', iconColor: '#7c3aed' },
    slate: { bg: '#f8fafc', border: '#e2e8f0', iconColor: '#475569' }
  };

  const scheme = colorStyles[color] || colorStyles.blue;

  return (
    <div className="card" style={{
      padding: '1.35rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#ffffff',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#64748b' }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: scheme.bg,
            color: scheme.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.85rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          lineHeight: 1
        }}>
          {value}
        </div>
        {trend && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: trend.isPositive ? '#059669' : '#dc2626'
          }}>
            {trend.text}
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.4rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
