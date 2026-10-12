import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Clock, 
  QrCode, 
  Calendar, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Award,
  Layers,
  MapPin
} from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import { EventCard } from '../../components/events/EventCard';
import { Countdown } from '../../components/common/Countdown';
import { Loading } from '../../components/common/Loading';
import { eventCategories } from '../../data/mockEvents';

export const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const events = await eventApi.getPublicEvents();
        setFeaturedEvents(events.slice(0, 4));
        setUpcomingEvents(events.slice(0, 6));
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const heroEvent = featuredEvents[0] || upcomingEvents[0];

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* ===================================================================
          1. HERO SECTION (Professional Light Theme with Blue Accents)
          =================================================================== */}
      <section style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        padding: '4rem 0 3.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background graphic */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(219, 234, 254, 0.6) 0%, rgba(255, 255, 255, 0) 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="grid grid-cols-2" style={{ alignItems: 'center', gap: '3rem' }}>
            
            {/* Hero Left Content */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-700)',
                border: '1px solid #bfdbfe',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={14} style={{ color: '#2563eb' }} />
                <span>Internal College Event Platform</span>
              </div>

              <h1 style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: '1.25rem'
              }}>
                Discover. <span style={{ color: '#2563eb' }}>Register.</span> Participate.
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '540px'
              }}>
                EventTracker unifies all internal college workshops, technical symposiums, hackathons, seminars, cultural fests, and sports into one seamless platform. No student accounts needed—register directly and get your instant digital entry pass.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/events" className="btn btn-primary btn-lg">
                  <Compass size={18} />
                  <span>Explore Upcoming Events</span>
                </Link>

                <Link to="/about" className="btn btn-outline btn-lg">
                  <span>How It Works</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.84rem',
                color: '#64748b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                  <span>Zero Student Login</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} style={{ color: '#2563eb' }} />
                  <span>Live Countdown Timers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <QrCode size={16} style={{ color: '#7c3aed' }} />
                  <span>Digital QR Entry Pass</span>
                </div>
              </div>
            </div>

            {/* Hero Right Featured Event Card */}
            {heroEvent && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '1.75rem',
                  width: '100%',
                  maxWidth: '460px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-category" style={{ fontSize: '0.78rem' }}>
                      {heroEvent.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> Featured Spotlight
                    </span>
                  </div>

                  <img
                    src={heroEvent.poster}
                    alt={heroEvent.name}
                    style={{
                      width: '100%',
                      height: '190px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-lg)',
                      marginBottom: '1rem'
                    }}
                  />

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {heroEvent.name}
                  </h3>

                  <div style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={14} style={{ color: '#2563eb' }} />
                      <span>{heroEvent.date} at {heroEvent.startTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} style={{ color: '#2563eb' }} />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{heroEvent.venue}</span>
                    </div>
                  </div>

                  {/* Hero Event Live Countdown */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Event Starts In:
                    </div>
                    <Countdown targetDate={heroEvent.date} targetTime={heroEvent.startTime} size="md" />
                  </div>

                  <Link to={`/events/${heroEvent.id}/register`} className="btn btn-primary" style={{ width: '100%' }}>
                    <span>Register for Event (Direct RSVP)</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. UPCOMING EVENTS GRID
          =================================================================== */}
      <section className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CAMPUS SCHEDULE
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
              Upcoming College Events
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b' }}>
              Explore workshops, technical symposiums, presentations, and sports happening on campus.
            </p>
          </div>

          <Link to="/events" className="btn btn-outline" style={{ fontSize: '0.88rem' }}>
            <span>View Full Directory ({upcomingEvents.length})</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading upcoming college events..." />
        ) : (
          <div className="grid grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ===================================================================
          3. HOW IT WORKS (3-Step Student & Host Flow)
          =================================================================== */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              FRICTIONLESS EXPERIENCE
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
              How EventTracker Works
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748b' }}>
              Designed specifically for college efficiency: Students RSVP directly without accounts, while faculty hosts verify attendees using instant QR code scanning.
            </p>
          </div>

          <div className="grid grid-cols-3">
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <Compass size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                1. Browse & Discover
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                Explore all verified internal events filtered by Department, Category, or Date. Check live second-by-second countdown timers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                2. Direct RSVP (No Login)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                Students fill in their name, roll number, department, and email to confirm attendance. Instant seat reservation within venue limits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <QrCode size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                3. Digital Pass & Entry
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                Receive an instant digital entry pass with a unique verification QR code. Present it at the venue for instant host attendance check-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. EVENT CATEGORIES QUICK EXPLORER
          =================================================================== */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Handling All Types of College Events
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Not just technical symposiums—EventTraker handles every event category across departments.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {eventCategories.map((category) => (
            <Link
              key={category}
              to={`/events?category=${encodeURIComponent(category)}`}
              className="card"
              style={{
                padding: '1.25rem',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Layers size={20} />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {category}
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                View Scheduled →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================================================================
          5. ROLE ACCESS CALLOUT
          =================================================================== */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '0.5rem' }}>
              Are you a Faculty Host or Department Head?
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#1e40af', lineHeight: 1.6 }}>
              Log in to the Host Portal to create new events, publish schedules, monitor registered student rosters, and scan entry QR codes on event day.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/host/login" className="btn btn-primary btn-lg">
              <Users size={18} />
              <span>Host / Organizer Portal</span>
            </Link>
            <Link to="/admin/login" className="btn btn-outline btn-lg" style={{ backgroundColor: '#ffffff' }}>
              <ShieldCheck size={18} />
              <span>Admin Governance</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
