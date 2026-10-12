import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Users, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      marginTop: 'auto',
      padding: '3.5rem 0 1.75rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div className="grid grid-cols-4" style={{ gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Calendar size={18} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-main)'
              }}>
                Event<span style={{ color: '#2563eb' }}>Tracker</span>
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Internal College Event Management, Live Countdown, and Digital RSVP Tracker. Connecting campus students, faculty coordinators, and administration.
            </p>
            <div style={{
              display: 'inline-block',
              padding: '0.35rem 0.75rem',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              Official College Event Portal
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Explore Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-muted)' }}>About EventTracker</Link></li>
              <li><Link to="/events" style={{ color: 'var(--text-muted)' }}>Events Directory</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--text-muted)' }}>Contact Support</Link></li>
            </ul>
          </div>

          {/* Role Access (Host & Admin only) */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Staff & Organizer Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <li>
                <Link to="/host/login" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={14} style={{ color: '#2563eb' }} />
                  <span>Host / Organizer Login</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login" style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={14} style={{ color: '#1d4ed8' }} />
                  <span>Admin Management Login</span>
                </Link>
              </li>
              
            </ul>
          </div>

          {/* College Contact Info */}
          <div id="contact">
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              College Contact & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: '#2563eb', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>Dean Academic Office & Student Affairs Complex, Main Campus</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span>events@college.edu</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                <span>+91 (0) 44 2235 8000</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} EventTracker — College Event Management.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Internal College Use Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
