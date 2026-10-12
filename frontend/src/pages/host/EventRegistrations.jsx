import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Users, CheckCircle2, XCircle, Calendar, MapPin } from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import { registrationApi } from '../../services/registrationApi';
import { HostHeader } from '../../components/host/HostHeader';
import { RegistrationTable } from '../../components/host/RegistrationTable';
import { Loading } from '../../components/common/Loading';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';

export const EventRegistrations = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [evtData, regsData] = await Promise.all([
        eventApi.getEventById(eventId),
        registrationApi.getEventRegistrations(eventId)
      ]);
      setEvent(evtData);
      setRegistrations(regsData);
    } catch (err) {
      console.error('Failed to load event registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [eventId]);

  const handleToggleAttendance = async (regId) => {
    try {
      const updated = await registrationApi.toggleAttendanceStatus(regId);
      setToastMessage({
        message: updated.attended ? `Marked ${updated.studentName} as Present!` : `Marked ${updated.studentName} as Absent.`,
        type: updated.attended ? 'success' : 'info'
      });
      loadData();
    } catch (err) {
      setToastMessage({ message: err.message || 'Failed to toggle attendance.', type: 'error' });
    }
  };

  if (loading) return <Loading text="Loading student registrations & roster..." fullHeight />;

  if (!event) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <Link to="/host/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to My Events
        </Link>
      </div>
    );
  }

  const attendedCount = registrations.filter(r => r.attended).length;
  const attendanceRate = registrations.length ? Math.round((attendedCount / registrations.length) * 100) : 0;

  return (
    <div>
      <Toast
        message={toastMessage?.message}
        type={toastMessage?.type}
        onClose={() => setToastMessage(null)}
      />

      <HostHeader
        title={`Registrations: ${event.name}`}
        subtitle={`Managing registered students, attendance roster, and entry check-ins.`}
        action={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/host/events" className="btn btn-outline btn-sm">
              <ArrowLeft size={15} /> All Events
            </Link>
            <Link to={`/host/events/${event.id}/scanner`} className="btn btn-primary btn-sm">
              <QrCode size={15} /> QR Attendance Scanner
            </Link>
          </div>
        }
      />

      {/* Mini Stats Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div className="card" style={{ padding: '1rem 1.25rem', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>TOTAL REGISTRATIONS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {registrations.length} / {event.capacity}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>ATTENDANCE VERIFIED</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
            {attendedCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>TURNOUT RATE</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>
            {attendanceRate}%
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>AVAILABLE SEATS</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: event.capacity - registrations.length > 0 ? '#d97706' : 'var(--danger)', marginTop: '0.2rem' }}>
            {Math.max(0, event.capacity - registrations.length)}
          </div>
        </div>
      </div>

      {/* Registrations List Component */}
      <RegistrationTable
        registrations={registrations}
        onToggleAttendance={handleToggleAttendance}
        eventName={event.name}
      />
    </div>
  );
};
