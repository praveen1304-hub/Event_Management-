import React from 'react';

export const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toLowerCase();

  let badgeClass = 'badge-upcoming';
  let label = status || 'Upcoming';

  if (norm === 'live' || norm === 'in progress') {
    badgeClass = 'badge-live';
    label = 'Live Now';
  } else if (norm === 'completed' || norm === 'attended') {
    badgeClass = 'badge-completed';
    label = 'Completed';
  } else if (norm === 'cancelled' || norm === 'blocked' || norm === 'deactivated') {
    badgeClass = 'badge-cancelled';
    label = norm === 'blocked' ? 'Blocked' : (norm === 'deactivated' ? 'Deactivated' : 'Cancelled');
  } else if (norm === 'confirmed') {
    badgeClass = 'badge-confirmed';
    label = 'Confirmed';
  } else if (norm === 'pending' || norm === 'draft') {
    badgeClass = 'badge-pending';
    label = norm === 'draft' ? 'Draft' : 'Pending';
  } else if (norm === 'active') {
    badgeClass = 'badge-confirmed';
    label = 'Active';
  }

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        display: 'inline-block'
      }} />
      <span>{label}</span>
    </span>
  );
};
