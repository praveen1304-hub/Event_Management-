import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Hash, 
  Building2, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Mail,
  Send,
  Eye
} from 'lucide-react';
import { registrationApi } from '../../services/registrationApi';
import { Countdown } from '../../components/common/Countdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';

export const EntryPassPage = () => {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resending, setResending] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchPass = async () => {
      setLoading(true);
      try {
        const data = await registrationApi.getRegistrationById(registrationId);
        setRegistration(data);
      } catch (err) {
        setError(err.message || 'Entry pass not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPass();
  }, [registrationId]);

  const handlePrint = () => {
    window.print();
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await registrationApi.resendEmail(registration.id || registrationId);
      setEmailStatus(`Pass & QR Code re-sent to ${registration.email}!`);
      setTimeout(() => setEmailStatus(null), 3500);
    } catch (e) {
      setEmailStatus('Failed to send email: ' + e.message);
    } finally {
      setResending(false);
    }
  };

  if (loading) return <Loading text="Generating secure entry pass & QR code..." fullHeight />;

  if (error || !registration) {
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Pass Not Found</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/events" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const regCode = registration.registration_code || registration.eventCode;
  const rawId = registration.id || registration.registration_id;

  // QR Code Payload (JSON string representing ticket verification)
  const qrPayload = JSON.stringify({
    regId: rawId,
    code: regCode,
    eventId: registration.event_id || registration.eventId,
    roll: registration.roll_number || registration.rollNumber,
    name: registration.student_name || registration.studentName
  });

  return (
    <div className="main-content container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Link to={`/events/${registration.event_id || registration.eventId}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <ArrowLeft size={16} /> Back to Event Details
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmailModal(true)}
            icon={<Eye size={15} />}
          >
            Preview Email Pass
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResend}
            loading={resending}
            icon={<Mail size={15} />}
          >
            Resend Email
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer size={15} />}
          >
            Print / Save Pass (PDF)
          </Button>

          <Link to="/events" className="btn btn-primary btn-sm">
            Explore More Events
          </Link>
        </div>
      </div>

      {/* Email Status Alert */}
      {emailStatus && (
        <div className="no-print" style={{
          maxWidth: '640px',
          margin: '0 auto 1.5rem',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          color: '#065f46',
          fontSize: '0.86rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} style={{ color: '#059669' }} />
          <span>{emailStatus}</span>
        </div>
      )}

      {/* ===================================================================
          DIGITAL ENTRY PASS CARD (Boarding Pass / Ticket Style)
          =================================================================== */}
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        
        <div className="entry-pass-card" style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid #bfdbfe',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          
          {/* Ticket Header */}
          <div style={{
            background: 'var(--primary-gradient)',
            padding: '1.5rem 2rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#bfdbfe'
              }}>
                OFFICIAL COLLEGE DIGITAL ENTRY PASS
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                EventTracker Event Pass
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backdropFilter: 'blur(4px)'
            }}>
              {registration.attended ? '✓ ATTENDED' : 'CONFIRMED RSVP'}
            </div>
          </div>

          {/* Email Confirmation Notice Header */}
          <div style={{
            backgroundColor: '#eff6ff',
            borderBottom: '1px solid #bfdbfe',
            padding: '0.65rem 2rem',
            fontSize: '0.78rem',
            color: '#1d4ed8',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} /> Verification pass with QR code sent to <strong>{registration.email}</strong>
            </span>
            <button
              onClick={() => setShowEmailModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.76rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600
              }}
              className="no-print"
            >
              Preview Email Pass ↗
            </button>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '2rem' }}>
            
            {/* Event Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Event
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                {registration.event_name || registration.eventName}
              </h2>
            </div>

            {/* Event Schedule Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.25rem',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              fontSize: '0.88rem'
            }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>EVENT DATE</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {registration.event_date || registration.eventDate}
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>START TIME</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {registration.event_time || registration.eventTime}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>CAMPUS VENUE</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                  {registration.event_venue || registration.eventVenue}
                </div>
              </div>
            </div>

            {/* Student Attendee Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.75rem',
              fontSize: '0.88rem'
            }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>STUDENT NAME</div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                  {registration.student_name || registration.studentName}
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>ROLL NUMBER</div>
                <div style={{
                  fontFamily: 'monospace',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: '#1d4ed8'
                }}>
                  {registration.roll_number || registration.rollNumber}
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>DEPARTMENT</div>
                <div style={{ color: '#334155' }}>
                  {registration.department}
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>YEAR OF STUDY</div>
                <div style={{ color: '#334155' }}>
                  {registration.year}
                </div>
              </div>
            </div>

            {/* QR Code & Unique Event Code Section */}
            <div style={{
              borderTop: '2px dashed #cbd5e1',
              paddingTop: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  UNIQUE ENTRY CODE
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#2563eb',
                  letterSpacing: '0.05em',
                  marginTop: '0.15rem'
                }}>
                  {regCode}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Pass ID: <code>reg-{rawId}</code>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '0.5rem' }}>
                  ✓ Present this code or QR at entry
                </div>
              </div>

              {/* Generated QR Code */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '0.65rem',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <QRCodeSVG
                  value={qrPayload}
                  size={120}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>

            {/* Countdown widget inside pass */}
            <div className="no-print" style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-light)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Time Remaining Until Event Starts
              </div>
              <Countdown targetDate={registration.event_date || registration.eventDate} targetTime={registration.event_time || registration.eventTime} size="sm" />
            </div>

          </div>

          {/* Ticket Footer Bar */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid var(--border-light)',
            padding: '0.85rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.74rem',
            color: '#64748b'
          }}>
            <span>Issued: {registration.registration_date || registration.registrationDate}</span>
            <span>Non-transferable • College ID Required</span>
          </div>

        </div>

      </div>

      {/* Email Preview Modal */}
      <EmailPreviewModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        registration={registration}
      />
    </div>
  );
};
