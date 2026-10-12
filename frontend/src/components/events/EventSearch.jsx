import React from 'react';
import { Search, X } from 'lucide-react';

export const EventSearch = ({ value, onChange, onClear, placeholder = 'Search events by name, topic, venue, or host...' }) => {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    }}>
      <div style={{
        position: 'absolute',
        left: '1rem',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none'
      }}>
        <Search size={18} />
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem 2.75rem 0.75rem 2.75rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.92rem',
          color: 'var(--text-main)',
          boxShadow: 'var(--shadow-xs)',
          transition: 'all 0.15s ease'
        }}
        className="form-input"
      />

      {value && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: '0.85rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '50%'
          }}
          title="Clear search query"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
