import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Hash, 
  Building2, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  QrCode, 
  AlertCircle,
  Send,
  Eye,
  RefreshCw,
  Ticket,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getApiBaseUrl } from '../../services/api';
import { eventApi } from '../../services/eventApi';
import { registrationApi } from '../../services/registrationApi';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { EmailPreviewModal } from '../../components/common/EmailPreviewModal';

export const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailNotice, setEmailNotice] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Form State (NO PASSWORD / NO USERNAME / NO LOGIN)
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    email: ''
  });

  const departmentOptions = [
    'Computer Science & Engineering',
    'Information Technology',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Management Studies (MBA)',
    'Science & Humanities (MCA / M.Sc)'
  ];

  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG / Master Student'];

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await eventApi.getEventById(eventId);
        setEvent(data);
      } catch (err) {
        setErrorMessage(err.message || 'Event not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
    setDuplicateInfo(null);
  };

  const handleRegister = async (allowUpdate = false) => {
    setErrorMessage(null);
    setDuplicateInfo(null);
    if (allowUpdate) setUpdating(true);
    else setSubmitting(true);

    try {
      const cleanId = String(event.id).replace('evt-', '');
      const payload = {
        student_name: formData.studentName.trim(),
        roll_number: formData.rollNumber.trim().toUpperCase(),
        department: formData.department.trim(),
        year: formData.year.trim(),
        email: formData.email.trim().toLowerCase(),
        allow_update: allowUpdate
      };

      const apiUrl = `${getApiBaseUrl()}/events/${cleanId}/register`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 409) {
        // Already registered -> Extract existing registration details
        const existingData = result.registration || result.data || result.errors || {};
        setDuplicateInfo({
          id: existingData.registration_id || existingData.id,
          code: existingData.registration_code || existingData.eventCode || 'CP-PASS',
          roll: existingData.roll_number || formData.rollNumber,
          name: existingData.student_name || formData.studentName,
          email: existingData.email || formData.email,
          message: result.message || 'You are already registered for this event.'
        });
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || `Registration failed (${response.status})`);
      }

      const regData = result.registration || result.data || result;
      // Preserve email_sent status from API
      regData.email_sent = result.email_sent !== undefined ? result.email_sent : regData.email_sent;
      setRegistrationSuccess(regData);

      // Trigger celebratory confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit registration.');
    } finally {
      setSubmitting(false);
      setUpdating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(false);
  };

  const handleResendEmail = async () => {
    const activeReg = registrationSuccess || duplicateInfo;
    if (!activeReg) return;
    setResendingEmail(true);
    try {
      const regId = activeReg.id || activeReg.registration_id;
      const res = await registrationApi.resendEmail(regId);
      setEmailNotice(`Confirmation email resent to ${activeReg.email || formData.email}!`);
      setTimeout(() => setEmailNotice(null), 4000);
    } catch (err) {
      setEmailNotice('Notice: Could not send email via current SMTP server.');
    } finally {
      setResendingEmail(false);
    }
  };

  if (loading) return <Loading text="Loading registration form..." fullHeight />;

  if (!event) {
    return (
      <div className="container main-content" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Event Not Found</h2>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Events Directory
        </Link>
      </div>
    );
  }

  // ===================================================================
  // REGISTRATION SUCCESSFUL VIEW
  // ===================================================================
  if (registrationSuccess) {
    const regId = registrationSuccess.id || registrationSuccess.registration_id;
    const eventCode = registrationSuccess.registration_code || registrationSuccess.eventCode;
    const studentEmail = registrationSuccess.email || formData.email;
    const isEmailSent = registrationSuccess.email_sent === true;

    return (
      <div className="main-content container" style={{ padding: '3.5rem 1.25rem 5rem' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          
          {/* Success Icon */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            border: '2px solid #a7f3d0'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            REGISTRATION CONFIRMED
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
            Registration Successful!
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Your seat is officially reserved. Your digital entry pass and unique registration code are ready.
          </p>

          {/* Verification Email Confirmation Banner */}
          {isEmailSent ? (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #93c5fd',
              borderRadius: 'var(--radius-lg)',
              padding: '1.1rem 1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Mail size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e3a8a' }}>
                  Confirmation Email Sent
                </div>
                <div style={{ fontSize: '0.82rem', color: '#1e40af', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  Registration successful. Confirmation email sent to <strong>{studentEmail}</strong> with your Registration Code (<strong>{eventCode}</strong>).
                </div>
                {emailNotice && (
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, marginTop: '0.4rem' }}>
                    {emailNotice}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: 'var(--radius-lg)',
              padding: '1.1rem 1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fef9c3',
                color: '#a16207',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#854d0e' }}>
                  Pass Generated in System
                </div>
                <div style={{ fontSize: '0.82rem', color: '#713f12', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  Registration successful, but the confirmation email could not be sent. Please save or view your digital pass below.
                </div>
                {emailNotice && (
                  <div style={{ fontSize: '0.78rem', color: '#854d0e', fontWeight: 600, marginTop: '0.4rem' }}>
                    {emailNotice}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event & Student Summary Card */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Event:</span>
              <strong style={{ color: 'var(--text-main)', textAlign: 'right', maxWidth: '65%' }}>{registrationSuccess.eventName || registrationSuccess.event_name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Student Name:</span>
              <strong style={{ color: 'var(--text-main)' }}>{registrationSuccess.studentName || registrationSuccess.student_name} ({registrationSuccess.rollNumber || registrationSuccess.roll_number})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Date & Time:</span>
              <strong style={{ color: 'var(--text-main)' }}>{registrationSuccess.eventDate || registrationSuccess.event_date} at {registrationSuccess.eventTime || registrationSuccess.event_time}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Venue:</span>
              <strong style={{ color: 'var(--text-main)', textAlign: 'right', maxWidth: '65%' }}>{registrationSuccess.eventVenue || registrationSuccess.event_venue}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.2rem' }}>
              <span style={{ color: '#64748b' }}>Registration Code:</span>
              <strong style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: '1.05rem', letterSpacing: '0.04em' }}>{eventCode}</strong>
            </div>
          </div>

          {/* Action Buttons: View Entry Pass & Resend / Preview Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to={`/entry-pass/${regId}`}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <QrCode size={18} />
              <span>View Digital Entry Pass & QR</span>
            </Link>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                loading={resendingEmail}
                icon={<Send size={14} />}
                style={{ flex: 1 }}
              >
                Resend Email
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmailModal(true)}
                icon={<Eye size={14} />}
                style={{ flex: 1 }}
              >
                Preview Email
              </Button>
            </div>

            <Link
              to={`/events/${event.id}`}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '0.25rem' }}
            >
              Back to Event Details
            </Link>
          </div>

        </div>

        {/* Email Preview Modal */}
        <EmailPreviewModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          registration={registrationSuccess}
        />
      </div>
    );
  }

  // ===================================================================
  // REGISTRATION FORM VIEW
  // ===================================================================
  return (
    <div className="main-content container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      
      {/* Back Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={`/events/${event.id}`} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <ArrowLeft size={16} /> Back to Event Details
        </Link>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        
        {/* Header Capsule */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
            {event.category}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Student Event Registration
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#64748b' }}>
            Registering for: <strong style={{ color: 'var(--text-main)' }}>{event.name}</strong>
          </p>
        </div>

        {/* Mini Event Schedule Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.84rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} style={{ color: '#2563eb' }} />
            <span><strong>Date:</strong> {event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} style={{ color: '#2563eb' }} />
            <span><strong>Time:</strong> {event.startTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} style={{ color: '#2563eb' }} />
            <span style={{ maxWidth: '160px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {event.venue}
            </span>
          </div>
        </div>

        {/* ===================================================================
            SMART ALREADY REGISTERED HELPER BANNER
            =================================================================== */}
        {duplicateInfo && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Ticket size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', margin: '0 0 0.35rem' }}>
                  You Are Already Registered!
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#334155', margin: '0 0 0.85rem', lineHeight: 1.5 }}>
                  A registration already exists for Roll Number <strong>{duplicateInfo.roll}</strong>.
                  Your unique registration code is <strong style={{ color: '#1d4ed8', fontFamily: 'monospace' }}>{duplicateInfo.code}</strong>.
                </p>

                {/* Instant Actions for Existing Registration */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <Link
                    to={`/entry-pass/${duplicateInfo.id || duplicateInfo.code}`}
                    className="btn btn-primary btn-sm"
                  >
                    <QrCode size={15} />
                    <span>Open My Entry Pass & QR</span>
                  </Link>

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
                    onClick={() => handleRegister(true)}
                    loading={updating}
                    icon={<RefreshCw size={14} />}
                  >
                    Update Details & Resend Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Standard Error Alert Box (for non-duplicate errors) */}
        {errorMessage && !duplicateInfo && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div>
              <strong>Registration Notice:</strong>
              <div style={{ marginTop: '0.2rem' }}>{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Registration Form Card */}
        <div className="card" style={{ padding: '2.25rem', backgroundColor: '#ffffff' }}>
          
          <form onSubmit={handleSubmit}>
            {/* Student Full Name */}
            <Input
              label="Student Full Name"
              placeholder="e.g. Praveen Kumar"
              value={formData.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
              icon={<User size={16} />}
              required
            />

            {/* Roll Number */}
            <Input
              label="College Roll Number / Registration ID"
              placeholder="e.g. 21CS084"
              value={formData.rollNumber}
              onChange={(e) => handleChange('rollNumber', e.target.value)}
              icon={<Hash size={16} />}
              helperText="Used to generate your unique event entry code and prevent duplicate passes."
              required
            />

            {/* Department Dropdown */}
            <div className="form-group">
              <label className="form-label">
                Department / Program <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '0.85rem', color: '#64748b', display: 'flex', pointerEvents: 'none' }}>
                  <Building2 size={16} />
                </div>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="form-select"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                >
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Year of Study */}
            <div className="form-group">
              <label className="form-label">
                Year of Study <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '0.85rem', color: '#64748b', display: 'flex', pointerEvents: 'none' }}>
                  <GraduationCap size={16} />
                </div>
                <select
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  className="form-select"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student College Email */}
            <Input
              label="College / Personal Email"
              type="email"
              placeholder="e.g. praveen.kumar@college.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              icon={<Mail size={16} />}
              helperText="Your registration code and pass details will be sent directly to this address."
              required
            />

            {/* Notice */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: '0.78rem',
              color: '#64748b',
              marginBottom: '1.5rem'
            }}>
              📧 <strong>Instant Confirmation:</strong> Once submitted, your registration is committed immediately to the database and a confirmation email is dispatched to your address.
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              style={{ width: '100%' }}
              loading={submitting}
            >
              <span>Confirm Registration & Send Confirmation Email</span>
              <ArrowRight size={18} />
            </Button>
          </form>

        </div>

      </div>

      {/* Email Preview Modal for Duplicate or Success */}
      <EmailPreviewModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        registration={duplicateInfo || registrationSuccess}
      />
    </div>
  );
};
