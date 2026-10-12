import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Hourglass, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldAlert,
  Share2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import { Countdown } from '../../components/common/Countdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';

export const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await eventApi.getEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [eventId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <Loading text="Loading event details & live countdown..." fullHeight />;

  if (error || !event) {
    return (
      <div className="container main-content" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '2.5rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)'
        }}>
          <AlertCircle size={42} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Event Not Found</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/events" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Events Directory
          </Link>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;
  const isCompleted = event.status === 'Completed';
  const isCancelled = event.status === 'Cancelled';
  
  const today = new Date().toISOString().split('T')[0];
  const isDeadlinePassed = event.registrationDeadline ? today > event.registrationDeadline : false;
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div className="main-content container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      
      {/* Back Button & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <Link to="/events" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          icon={<Share2 size={14} />}
        >
          {copied ? 'Link Copied!' : 'Share Event'}
        </Button>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2.5rem', alignItems: 'flex-start' }}>
        
        {/* Left 2 Columns: Main Details */}
        <div style={{ gridColumn: 'span 2' }}>
          {/* Banner Poster */}
          <div style={{
            width: '100%',
            height: '360px',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            backgroundColor: '#f1f5f9',
            marginBottom: '2rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <img
              src={event.poster}
              alt={event.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-category" style={{ fontSize: '0.84rem', padding: '0.35rem 0.85rem' }}>
              {event.category}
            </span>
            <StatusBadge status={event.status} />
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem'
          }}>
            {event.name}
          </h1>

          {/* Description */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
              About This Event
            </h2>
            <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
          </div>

          {/* Event Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={20} style={{ color: '#2563eb' }} />
                Rules & Participation Guidelines
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {event.rules.map((rule, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', color: '#475569' }}>
                    <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0, marginTop: '0.15rem' }} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Column: Schedule, Live Countdown & RSVP Card */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div className="card" style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            
            {/* Live Countdown Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '0.65rem'
              }}>
                <Clock size={14} />
                <span>Live Event Countdown</span>
              </div>
              <Countdown targetDate={event.date} targetTime={event.startTime} size="lg" />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

            {/* Quick Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Calendar size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Date:</strong>
                  <div style={{ color: '#475569' }}>{event.date}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Time:</strong>
                  <div style={{ color: '#475569' }}>{event.startTime} {event.endTime ? `to ${event.endTime}` : ''}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Venue:</strong>
                  <div style={{ color: '#475569' }}>{event.venue}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Users size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Organized By:</strong>
                  <div style={{ color: '#475569' }}>{event.organizer || event.hostName}</div>
                </div>
              </div>

              {event.registrationDeadline && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <Hourglass size={18} style={{ color: isDeadlinePassed ? 'var(--danger)' : '#d97706', flexShrink: 0, marginTop: '0.15rem' }} />
                  <div>
                    <strong style={{ color: isDeadlinePassed ? 'var(--danger)' : 'var(--text-main)' }}>Registration Cutoff:</strong>
                    <div style={{ color: isDeadlinePassed ? 'var(--danger)' : '#475569' }}>
                      {event.registrationDeadline} {isDeadlinePassed ? '(Expired)' : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Capacity Progress Bar */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '0.4rem'
              }}>
                <span>Capacity Filled</span>
                <span style={{ color: isFull ? 'var(--danger)' : '#2563eb' }}>
                  {event.registeredCount} / {event.capacity} ({capacityPercent}%)
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#e2e8f0',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${capacityPercent}%`,
                  backgroundColor: isFull ? 'var(--danger)' : '#2563eb',
                  borderRadius: 'var(--radius-full)'
                }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                {event.capacity - event.registeredCount > 0 
                  ? `${event.capacity - event.registeredCount} seats remaining` 
                  : 'Venue at maximum capacity'}
              </div>
            </div>

            {/* Register CTA Button */}
            <div>
              <Link
                to={`/events/${event.id}/register`}
                style={{ width: '100%', textDecoration: 'none' }}
              >
                <Button
                  variant={isFull || isDeadlinePassed || isCompleted || isCancelled ? 'outline' : 'primary'}
                  size="lg"
                  style={{ width: '100%' }}
                  disabled={isFull || isDeadlinePassed || isCompleted || isCancelled}
                >
                  {isFull ? (
                    'Event Seats Full'
                  ) : isDeadlinePassed ? (
                    'Registration Closed'
                  ) : isCompleted ? (
                    'Event Completed'
                  ) : isCancelled ? (
                    'Event Cancelled'
                  ) : (
                    <>
                      <span>Register / RSVP Now</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </Link>
              <p style={{
                fontSize: '0.74rem',
                color: '#64748b',
                textAlign: 'center',
                marginTop: '0.5rem'
              }}>
                Direct Student Registration • No Password Required
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
