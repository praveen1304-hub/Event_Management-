import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  Sparkles,
  Users,
  ScanLine
} from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import { registrationApi } from '../../services/registrationApi';
import { HostHeader } from '../../components/host/HostHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';

export const QRScanner = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scanner State
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const evt = await eventApi.getEventById(eventId);
        setEvent(evt);
      } catch (err) {
        console.error('Failed to load event for scanner', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleVerify = async (codeToVerify) => {
    const targetCode = (codeToVerify || inputCode).trim();
    if (!targetCode) return;

    setVerifying(true);
    setScanResult(null);

    try {
      // If code was pasted as JSON from a QR scanner library, parse it
      let parsedCode = targetCode;
      try {
        if (targetCode.startsWith('{')) {
          const parsed = JSON.parse(targetCode);
          parsedCode = parsed.code || parsed.regId || parsed.roll || targetCode;
        }
      } catch (e) {}

      const result = await registrationApi.verifyAndMarkAttendance({
        eventId: event.id,
        codeOrId: parsedCode
      });

      setScanResult(result);
      if (result.registration) {
        setRecentScans(prev => [
          {
            ...result.registration,
            scanStatus: result.status,
            scanTime: new Date().toLocaleTimeString()
          },
          ...prev.slice(0, 9)
        ]);
      }
      setInputCode('');
    } catch (err) {
      setScanResult({
        valid: false,
        status: 'ERROR',
        message: err.message || 'Verification failed.'
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <Loading text="Initializing QR Scanner interface..." fullHeight />;

  return (
    <div>
      <HostHeader
        title={`QR Attendance: ${event?.name}`}
        subtitle="Scan student digital entry passes or enter verification codes to mark entry."
        action={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/host/events/${eventId}/registrations`} className="btn btn-outline btn-sm">
              <Users size={15} /> View Attendance List
            </Link>
            <Link to="/host/events" className="btn btn-outline btn-sm">
              <ArrowLeft size={15} /> Back to Events
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Simulated Camera Viewfinder & Manual Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Simulated Optical QR Scanner Viewfinder */}
          <div className="card" style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '320px',
              height: '240px',
              backgroundColor: '#0f172a',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
              marginBottom: '1.25rem'
            }}>
              {/* Corner Targets */}
              <div style={{ position: 'absolute', top: 16, left: 16, width: 28, height: 28, borderTop: '3px solid #3b82f6', borderLeft: '3px solid #3b82f6', borderRadius: '4px 0 0 0' }} />
              <div style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderTop: '3px solid #3b82f6', borderRight: '3px solid #3b82f6', borderRadius: '0 4px 0 0' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, width: 28, height: 28, borderBottom: '3px solid #3b82f6', borderLeft: '3px solid #3b82f6', borderRadius: '0 0 0 4px' }} />
              <div style={{ position: 'absolute', bottom: 16, right: 16, width: 28, height: 28, borderBottom: '3px solid #3b82f6', borderRight: '3px solid #3b82f6', borderRadius: '0 0 4px 0' }} />

              {/* Animated Laser Scanning Line */}
              <div className="scanner-laser-line" style={{
                position: 'absolute',
                width: '80%',
                height: '2px',
                backgroundColor: '#38bdf8',
                boxShadow: '0 0 12px #38bdf8, 0 0 24px #38bdf8'
              }} />

              <div style={{ color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={38} style={{ color: '#38bdf8', opacity: 0.8 }} />
                <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>
                  Camera Ready / Scan Pass
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Position the student's digital pass QR code in front of the lens or enter pass code below.
            </p>
          </div>

          {/* Manual Entry Form */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ScanLine size={18} style={{ color: '#2563eb' }} />
              Manual Code / Roll Number Check
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
              <Input
                label="Enter Event Code, Pass ID, or Roll Number"
                placeholder="e.g. CP-AI-90184 or 21CS084"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                style={{ width: '100%' }}
                loading={verifying}
                icon={<CheckCircle2 size={16} />}
              >
                Verify & Mark Attendance
              </Button>
            </form>

            {/* Quick Demo Test Buttons */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Quick Test Samples for Demo:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleVerify('CP-AI-90184')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                >
                  Test: Valid Code (Praveen)
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify('CP-AI-90212')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem' }}
                >
                  Test: Already Attended
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify('INVALID-FAKE-CODE')}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', color: 'var(--danger)' }}
                >
                  Test: Invalid Code
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Scan Verification Result & Activity Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Verification Feedback Box */}
          {scanResult ? (
            <div className="card" style={{
              padding: '2rem',
              backgroundColor: scanResult.valid ? 'var(--success-bg)' : (scanResult.status === 'ALREADY_MARKED' ? 'var(--warning-bg)' : 'var(--danger-bg)'),
              border: `1px solid ${scanResult.valid ? '#a7f3d0' : (scanResult.status === 'ALREADY_MARKED' ? '#fde68a' : '#fecaca')}`,
              animation: 'slideIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                {scanResult.valid ? (
                  <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
                ) : scanResult.status === 'ALREADY_MARKED' ? (
                  <AlertTriangle size={32} style={{ color: 'var(--warning)' }} />
                ) : (
                  <XCircle size={32} style={{ color: 'var(--danger)' }} />
                )}

                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: scanResult.valid ? 'var(--success-text)' : (scanResult.status === 'ALREADY_MARKED' ? 'var(--warning-text)' : 'var(--danger-text)')
                  }}>
                    {scanResult.valid ? 'Entry Verified' : (scanResult.status === 'ALREADY_MARKED' ? 'Attendance Already Marked' : 'Invalid Registration')}
                  </h3>
                  <div style={{ fontSize: '0.86rem', color: '#475569', marginTop: '0.15rem' }}>
                    {scanResult.message}
                  </div>
                </div>
              </div>

              {/* Student Record Card if found */}
              {scanResult.registration && (
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Student Name:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{scanResult.registration.studentName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Roll Number:</span>
                    <strong style={{ fontFamily: 'monospace', color: '#1d4ed8' }}>{scanResult.registration.rollNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Department:</span>
                    <span>{scanResult.registration.department}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Event:</span>
                    <span style={{ fontWeight: 600 }}>{scanResult.registration.eventName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Pass Code:</span>
                    <code style={{ color: '#2563eb' }}>{scanResult.registration.eventCode}</code>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{
              padding: '2.5rem 1.5rem',
              backgroundColor: '#ffffff',
              textAlign: 'center',
              border: '1px dashed #cbd5e1'
            }}>
              <QrCode size={36} style={{ color: '#94a3b8', margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Waiting for Scan or Code
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Results and attendee verification details will appear here instantly.
              </p>
            </div>
          )}

          {/* Recent Scans Stream */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Recent Check-ins Session Log
            </h3>

            {recentScans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', fontSize: '0.84rem', color: '#94a3b8' }}>
                No check-ins scanned yet during this session.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {recentScans.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.84rem'
                  }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>{item.studentName}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.rollNumber} • {item.department}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.78rem' }}>
                        ✓ {item.scanTime}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.eventCode}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @keyframes scanMove {
          0% { top: 15%; opacity: 0.8; }
          50% { top: 85%; opacity: 1; }
          100% { top: 15%; opacity: 0.8; }
        }
        .scanner-laser-line {
          animation: scanMove 2.5s infinite ease-in-out;
        }
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
