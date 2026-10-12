import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  CalendarCheck, 
  Users, 
  CheckCircle2, 
  PlusCircle, 
  QrCode, 
  Edit3, 
  Eye, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';
import { hostApi } from '../../services/hostApi';
import { HostHeader } from '../../components/host/HostHeader';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Countdown } from '../../components/common/Countdown';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';

export const HostDashboard = () => {
  const { host } = useHostAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!host) return;
      setLoading(true);
      try {
        const data = await hostApi.getHostDashboardStats(host.id);
        setStats(data);
      } catch (err) {
        console.error('Failed to load host dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [host]);

  if (loading) return <Loading text="Loading your host dashboard..." fullHeight />;

  return (
    <div>
      {/* Top Header */}
      <HostHeader
        title={`Welcome back, ${host?.name?.split(' ')[0] || 'Host'}`}
        subtitle={`Managing events for ${host?.organization || host?.department}`}
        action={
          <Link to="/host/events/create">
            <Button variant="primary" size="sm" icon={<PlusCircle size={16} />}>
              Create New Event
            </Button>
          </Link>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="Total Events Created"
          value={stats?.totalEvents || 0}
          icon={<CalendarDays size={20} />}
          color="blue"
        />

        <StatCard
          title="Upcoming Active Events"
          value={stats?.upcomingEventsCount || 0}
          icon={<CalendarCheck size={20} />}
          color="purple"
        />

        <StatCard
          title="Total RSVPs Received"
          value={stats?.totalRegistrations || 0}
          icon={<Users size={20} />}
          color="amber"
        />

        <StatCard
          title="Attendance Verified"
          value={`${stats?.totalAttendance || 0} (${stats?.attendanceRate || 0}%)`}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
      </div>

      {/* Host's Events Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              My Managed Events
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#64748b' }}>
              Events created and organized under your department account.
            </p>
          </div>

          <Link to="/host/events" className="btn btn-outline btn-sm">
            <span>View All ({stats?.events?.length || 0})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.events?.length === 0 ? (
          <EmptyState
            title="No Events Created Yet"
            description="Create your first college workshop, hackathon, or seminar to start receiving student registrations."
            actionLabel="Create Event Now"
            onAction={() => window.location.href = '/host/events/create'}
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Details</th>
                  <th>Schedule</th>
                  <th>Venue</th>
                  <th>Registrations / Cap</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.events.slice(0, 5).map((evt) => (
                  <tr key={evt.id}>
                    {/* Event Name */}
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{evt.name}</div>
                      <span className="badge badge-category" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                        {evt.category}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{evt.date}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{evt.startTime}</div>
                    </td>

                    {/* Venue */}
                    <td style={{ fontSize: '0.84rem', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {evt.venue}
                    </td>

                    {/* Registered / Capacity */}
                    <td>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#2563eb' }}>
                        {evt.registeredCount} / {evt.capacity}
                      </div>
                      <div style={{
                        width: '60px',
                        height: '4px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        marginTop: '0.25rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100))}%`,
                          backgroundColor: evt.registeredCount >= evt.capacity ? 'var(--danger)' : '#2563eb'
                        }} />
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={evt.status} />
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {/* View Registrations */}
                        <Link
                          to={`/host/events/${evt.id}/registrations`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="View Registrations"
                        >
                          <Users size={13} /> Registrations
                        </Link>

                        {/* Scanner */}
                        <Link
                          to={`/host/events/${evt.id}/scanner`}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Open QR Scanner"
                        >
                          <QrCode size={13} /> QR Scanner
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`/host/events/${evt.id}/edit`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Edit Event"
                        >
                          <Edit3 size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
