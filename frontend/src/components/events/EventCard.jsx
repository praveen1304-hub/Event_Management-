import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Countdown } from '../common/Countdown';
import { StatusBadge } from '../common/StatusBadge';

export const EventCard = ({ event }) => {
  const isFull = event.registeredCount >= event.capacity;
  const isDraft = event.status === 'Draft';
  const isCompleted = event.status === 'Completed';
  const isCancelled = event.status === 'Cancelled';
  
  const today = new Date().toISOString().split('T')[0];
  const isDeadlinePassed = event.registrationDeadline ? today > event.registrationDeadline : false;

  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  // Format date helper
  const formatDate = (dStr) => {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dStr;
    }
  };

  return (
    <div className="card event-card-item" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      overflow: 'hidden',
      transition: 'all 0.25s ease'
    }}>
      {/* Event Banner & Badge */}
      <div style={{
        position: 'relative',
        height: '180px',
        width: '100%',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden'
      }}>
        <img
          src={event.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="event-card-img"
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '0.4rem'
        }}>
          <span className="badge badge-category">
            {event.category}
          </span>
        </div>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px'
        }}>
          <StatusBadge status={event.status} />
        </div>
      </div>

      {/* Card Content */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        {/* Title */}
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '0.75rem',
          lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.name}
        </h3>

        {/* Metadata List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          fontSize: '0.84rem',
          color: '#475569',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span>{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={15} style={{ color: '#64748b', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>By {event.organizer || event.hostName}</span>
          </div>
        </div>

        {/* Live Countdown Clock Widget */}
        <div style={{ marginBottom: '1rem' }}>
          <Countdown targetDate={event.date} targetTime={event.startTime} size="sm" />
        </div>

        {/* Capacity Progress Bar */}
        <div style={{ marginBottom: '1.25rem', marginTop: 'auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            fontWeight: 600,
            color: '#64748b',
            marginBottom: '0.35rem'
          }}>
            <span>Seats: {event.registeredCount} / {event.capacity}</span>
            <span style={{ color: isFull ? 'var(--danger)' : '#2563eb' }}>
              {isFull ? 'Full' : `${event.capacity - event.registeredCount} Available`}
            </span>
          </div>
          <div style={{
            height: '6px',
            backgroundColor: '#f1f5f9',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${capacityPercent}%`,
              backgroundColor: isFull ? 'var(--danger)' : '#2563eb',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
          <Link
            to={`/events/${event.id}`}
            className="btn btn-outline btn-sm"
            style={{ flex: 1 }}
          >
            Details
          </Link>
          <Link
            to={`/events/${event.id}/register`}
            className={`btn btn-sm ${isFull || isDeadlinePassed || isCompleted || isCancelled ? 'btn-outline' : 'btn-primary'}`}
            style={{
              flex: 1.2,
              opacity: (isFull || isDeadlinePassed || isCompleted || isCancelled) ? 0.65 : 1,
              pointerEvents: (isCompleted || isCancelled) ? 'none' : 'auto'
            }}
          >
            {isFull ? 'Seats Full' : (isDeadlinePassed ? 'Closed' : 'Register Now')}
            {!isFull && !isDeadlinePassed && !isCompleted && !isCancelled && <ArrowRight size={14} />}
          </Link>
        </div>
      </div>

      <style>{`
        .event-card-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: #93c5fd;
        }
        .event-card-item:hover .event-card-img {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
};
