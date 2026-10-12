import React from 'react';
import { eventCategories } from '../../data/mockEvents';

export const EventFilter = ({
  selectedCategory = 'All',
  onSelectCategory,
  selectedDateFilter = 'all',
  onSelectDateFilter,
  eventCountsByCategory = {}
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Category Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.35rem',
        scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => onSelectCategory('All')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: selectedCategory === 'All' ? '1px solid #2563eb' : '1px solid var(--border-light)',
            backgroundColor: selectedCategory === 'All' ? 'var(--primary-600)' : '#ffffff',
            color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-body)',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            boxShadow: selectedCategory === 'All' ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
          }}
        >
          All Categories
        </button>

        {eventCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = eventCountsByCategory[cat];

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? '1px solid #2563eb' : '1px solid var(--border-light)',
                backgroundColor: isSelected ? 'var(--primary-600)' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--text-body)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              <span>{cat}</span>
              {typeof count === 'number' && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#64748b'
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Date Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginRight: '0.25rem' }}>
          Date Filter:
        </span>
        {[
          { id: 'all', label: 'All Dates' },
          { id: 'today', label: 'Today Only' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'this-month', label: 'This Month' }
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectDateFilter(d.id)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: selectedDateFilter === d.id ? '1px solid #93c5fd' : '1px solid transparent',
              backgroundColor: selectedDateFilter === d.id ? '#eff6ff' : 'transparent',
              color: selectedDateFilter === d.id ? '#1d4ed8' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
};
