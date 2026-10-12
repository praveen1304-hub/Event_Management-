import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const About = () => {
  return (
    <div className="main-content container" style={{ padding: '3.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-700)',
          border: '1px solid #bfdbfe',
          padding: '0.35rem 0.85rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} style={{ color: '#2563eb' }} />
          <span>About EventTracker</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Unifying College Event Management & RSVPs
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
          EventTracker is a lightweight, dedicated internal college platform designed to bring all campus activities, symposiums, technical seminars, and cultural fests into one central digital portal.
        </p>
      </div>

      {/* Why Platform is Needed */}
      <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
        <div className="grid grid-cols-2" style={{ gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              THE PROBLEM & SOLUTION
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem', marginBottom: '1rem' }}>
              Why Colleges Need EventTracker
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65, marginBottom: '1rem' }}>
              In traditional college environments, event notifications are fragmented across paper notices, scattered WhatsApp groups, and disconnected Google Forms. Students often miss registration deadlines or face overcrowded halls.
            </p>
            <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.65 }}>
              EventTracker solves this by providing a unified event calendar, real-time live countdowns, automated capacity enforcement, instant digital passes with QR codes, and quick attendance marking for faculty hosts.
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Unified Campus Hub</strong>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Every department workshop, hackathon, and sports event in one discoverable calendar.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Zero Student Login Friction</strong>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Students register directly with Name & Roll Number without creating passwords or accounts.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Live Second-by-Second Countdowns</strong>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Dynamic timers create urgency and prevent missed registration deadlines.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} style={{ color: '#059669', flexShrink: 0, marginTop: '0.2rem' }} />
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>Instant QR Verification</strong>
                <p style={{ fontSize: '0.84rem', color: '#64748b' }}>Fast attendance marking on event day eliminating paper registration sheets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholder Benefits Matrix */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Empowering the Entire College Community
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Tailored capabilities for students, event organizers, and central administrators.
          </p>
        </div>

        <div className="grid grid-cols-3" style={{ gap: '1.75rem' }}>
          {/* Student Benefits */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <GraduationCap size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              For Students
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', flex: 1 }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> No student login or password fatigue
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Filter events by department & category
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Instant digital entry pass with QR code
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Live countdowns to event dates & cutoffs
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Guaranteed seat within venue capacity
              </li>
            </ul>
            <Link to="/events" className="btn btn-outline btn-sm">
              Explore Events Directory →
            </Link>
          </div>

          {/* Host Benefits */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              For Event Hosts
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', flex: 1 }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Create, edit, and publish campus events
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Set seat limits & registration deadlines
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> Real-time attendee roster monitoring
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> One-click attendee CSV download
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#2563eb' }} /> QR scanner for instantaneous check-in
              </li>
            </ul>
            <Link to="/host/login" className="btn btn-outline btn-sm">
              Host / Organizer Portal →
            </Link>
          </div>

          {/* Admin Benefits */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              For Administrators
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: '#475569', marginBottom: '1.5rem', flex: 1 }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#1d4ed8' }} /> High-level college-wide engagement metrics
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#1d4ed8' }} /> Central oversight over all scheduled events
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#1d4ed8' }} /> Manage and moderate faculty host accounts
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#1d4ed8' }} /> Track college attendance participation trends
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={16} style={{ color: '#1d4ed8' }} /> Safe deactivation/cancel controls
              </li>
            </ul>
            <Link to="/admin/login" className="btn btn-primary btn-sm">
              Admin Governance →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};
