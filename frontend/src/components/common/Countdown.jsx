import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const Countdown = ({ targetDate, targetTime = '00:00', size = 'md', className = '' }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(`${targetDate}T${targetTime}`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (isNaN(target)) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: false };
      }

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        isCompleted: false
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (updated.isCompleted) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  if (timeLeft.isCompleted) {
    return (
      <div className={`countdown-ended-badge ${className}`} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: size === 'sm' ? '0.3rem 0.6rem' : '0.5rem 1rem',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        borderRadius: 'var(--radius-md)',
        fontSize: size === 'sm' ? '0.78rem' : '0.88rem',
        fontWeight: 600
      }}>
        <Clock size={size === 'sm' ? 13 : 16} />
        <span>Event In Progress / Concluded</span>
      </div>
    );
  }

  // Small size (Cards)
  if (size === 'sm') {
    return (
      <div className={`countdown-sm-container ${className}`} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 'var(--radius-md)',
        padding: '0.4rem 0.6rem',
        width: 'fit-content'
      }}>
        <Clock size={13} style={{ color: '#2563eb' }} />
        <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>
          <span>{String(timeLeft.days).padStart(2, '0')}d</span> :
          <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
          <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
          <span style={{ color: '#2563eb' }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>
    );
  }

  // Medium / Large size (Details, Hero, Entry Pass)
  const isLarge = size === 'lg';

  return (
    <div className={`countdown-full-container ${className}`} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: isLarge ? '0.75rem' : '0.5rem',
      maxWidth: isLarge ? '440px' : '320px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: isLarge ? 'var(--radius-lg)' : 'var(--radius-md)',
        padding: isLarge ? '0.85rem 0.5rem' : '0.55rem 0.35rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isLarge ? '1.85rem' : '1.35rem',
          fontWeight: 800,
          color: '#1d4ed8',
          lineHeight: 1
        }}>
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div style={{
          fontSize: isLarge ? '0.72rem' : '0.65rem',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          marginTop: '0.25rem'
        }}>
          Days
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: isLarge ? 'var(--radius-lg)' : 'var(--radius-md)',
        padding: isLarge ? '0.85rem 0.5rem' : '0.55rem 0.35rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isLarge ? '1.85rem' : '1.35rem',
          fontWeight: 800,
          color: '#1d4ed8',
          lineHeight: 1
        }}>
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div style={{
          fontSize: isLarge ? '0.72rem' : '0.65rem',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          marginTop: '0.25rem'
        }}>
          Hours
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: isLarge ? 'var(--radius-lg)' : 'var(--radius-md)',
        padding: isLarge ? '0.85rem 0.5rem' : '0.55rem 0.35rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isLarge ? '1.85rem' : '1.35rem',
          fontWeight: 800,
          color: '#1d4ed8',
          lineHeight: 1
        }}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div style={{
          fontSize: isLarge ? '0.72rem' : '0.65rem',
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          marginTop: '0.25rem'
        }}>
          Mins
        </div>
      </div>

      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: isLarge ? 'var(--radius-lg)' : 'var(--radius-md)',
        padding: isLarge ? '0.85rem 0.5rem' : '0.55rem 0.35rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: isLarge ? '1.85rem' : '1.35rem',
          fontWeight: 800,
          color: '#2563eb',
          lineHeight: 1
        }}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div style={{
          fontSize: isLarge ? '0.72rem' : '0.65rem',
          fontWeight: 700,
          color: '#2563eb',
          textTransform: 'uppercase',
          marginTop: '0.25rem'
        }}>
          Secs
        </div>
      </div>
    </div>
  );
};
