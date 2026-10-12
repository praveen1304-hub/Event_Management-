import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Mail, X, CheckCircle2, QrCode, Calendar, Clock, MapPin, ExternalLink, Printer } from 'lucide-react';
import { Button } from './Button';

export const EmailPreviewModal = ({ isOpen, onClose, registration }) => {
  if (!isOpen || !registration) return null;

  const eventName = registration.eventName || registration.event_name || 'Campus Event';
  const studentName = registration.studentName || registration.student_name || 'Student';
  const rollNumber = registration.rollNumber || registration.roll_number || 'N/A';
  const department = registration.department || 'N/A';
  const year = registration.year || 'N/A';
  const eventDate = registration.eventDate || registration.event_date || 'TBA';
  const eventTime = registration.eventTime || registration.event_time || 'TBA';
  const eventVenue = registration.eventVenue || registration.event_venue || 'Main Campus';
  const eventCode = registration.registration_code || registration.eventCode || 'N/A';
  const regId = registration.id || registration.registration_id || '';
  const email = registration.email || '';

  const qrPayload = JSON.stringify({
    code: eventCode,
    regId,
    roll: rollNumber,
    name: studentName
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        border: '1px solid #e2e8f0',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Modal Top Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} style={{ color: '#2563eb' }} />
            <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>
              Participant Verification Email Preview
            </strong>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mock Email Client Container */}
        <div style={{ padding: '1.5rem', backgroundColor: '#f1f5f9', flex: 1 }}>
          
          {/* Email Metadata Header */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.8rem',
            color: '#475569',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div><strong>From:</strong> CampusPulse Official Events &lt;events@campuspulse.edu&gt;</div>
            <div><strong>To:</strong> {email}</div>
            <div><strong>Subject:</strong> [CampusPulse] Official Entry Pass & QR Code: {eventName}</div>
          </div>

          {/* Rendered Email Body */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            
            {/* Email Banner Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
              color: '#ffffff',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bfdbfe', fontWeight: 700 }}>
                CAMPUSPULSE OFFICIAL VERIFICATION
              </div>
              <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                Digital Event Entry Pass
              </h3>
            </div>

            {/* Email Content */}
            <div style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.88rem', margin: '0 0 0.5rem', color: '#1e293b' }}>
                Dear <strong>{studentName}</strong>,
              </p>
              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1rem' }}>
                Your registration for <strong>{eventName}</strong> has been successfully confirmed. Below is your official entry pass, QR code, and Entry Code.
              </p>

              {/* Unique Entry Code Highlight Box */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '2px dashed #93c5fd',
                borderRadius: '10px',
                padding: '0.85rem',
                textAlign: 'center',
                margin: '1rem 0'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  UNIQUE ENTRY CODE
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#1d4ed8',
                  letterSpacing: '0.08em',
                  marginTop: '0.15rem'
                }}>
                  {eventCode}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '0.2rem' }}>
                  ✓ Confirmed & Active
                </div>
              </div>

              {/* QR Code Container */}
              <div style={{ textAlign: 'center', margin: '1.25rem 0' }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#ffffff',
                  padding: '0.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px'
                }}>
                  <QRCodeSVG value={qrPayload} size={130} level="H" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                  Present this QR code or Entry Code at the entrance.
                </div>
              </div>

              {/* Event & Student Details */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', margin: '1rem 0' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontWeight: 600, width: '35%' }}>Event:</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a', fontWeight: 700 }}>{eventName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontWeight: 600 }}>Date & Time:</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a', fontWeight: 700 }}>{eventDate} at {eventTime}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontWeight: 600 }}>Venue:</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a', fontWeight: 700 }}>{eventVenue}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontWeight: 600 }}>Roll Number:</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a', fontWeight: 700 }}>{rollNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontWeight: 600 }}>Department:</td>
                    <td style={{ padding: '6px 8px', color: '#0f172a', fontWeight: 700 }}>{department} ({year})</td>
                  </tr>
                </tbody>
              </table>

            </div>

            {/* Email Footer */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '0.85rem',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: '#64748b',
              borderTop: '1px solid #e2e8f0'
            }}>
              CampusPulse — College Event Countdown & RSVP Tracker
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
        }}>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button variant="primary" size="sm" onClick={() => window.print()} icon={<Printer size={14} />}>
            Print Pass
          </Button>
        </div>

      </div>
    </div>
  );
};
