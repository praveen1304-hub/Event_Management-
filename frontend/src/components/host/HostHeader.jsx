import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '../common/Button';

export const HostHeader = ({
  title = 'Host Dashboard',
  subtitle = 'Manage your events, monitor student RSVPs, and track attendance.',
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {action ? (
          action
        ) : (
          <Link to="/host/events/create">
            <Button variant="primary" size="sm" icon={<PlusCircle size={16} />}>
              Create Event
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
