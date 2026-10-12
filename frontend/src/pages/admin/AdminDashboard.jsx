import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  CalendarCheck, 
  Users, 
  UserCheck, 
  Ticket, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Loading } from '../../components/common/Loading';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminApi.getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading text="Loading college platform metrics..." fullHeight />;

  return (
    <div>
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Overall event volume, student registrations, host faculty accounts, and attendance metrics."
      />

      {/* 6 Metric Stat Cards Grid */}
      <div className="grid grid-cols-3" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatCard
          title="Total Events Scheduled"
          value={stats?.totalEvents || 0}
          subtitle="All departments combined"
          icon={<CalendarDays size={20} />}
          color="blue"
        />

        <StatCard
          title="Upcoming Active Events"
          value={stats?.upcomingEventsCount || 0}
          subtitle="Open for student registrations"
          icon={<CalendarCheck size={20} />}
          color="purple"
        />

        <StatCard
          title="Unique Students Registered"
          value={stats?.totalStudentsRegistered || 0}
          subtitle="Distinct roll numbers enrolled"
          icon={<Users size={20} />}
          color="amber"
        />

        <StatCard
          title="Active Host Organizers"
          value={stats?.totalHosts || 0}
          subtitle="Faculty & departmental heads"
          icon={<UserCheck size={20} />}
          color="slate"
        />

        <StatCard
          title="Total RSVPs Generated"
          value={stats?.totalRegistrations || 0}
          subtitle="Total entry passes issued"
          icon={<Ticket size={20} />}
          color="blue"
        />

        <StatCard
          title="Verified Attendance"
          value={`${stats?.totalAttendance || 0} (${stats?.overallAttendanceRate || 0}%)`}
          subtitle="Completed entry QR check-ins"
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
      </div>

      {/* 2-Column Section: Upcoming Events + Recent Registrations */}
      <div className="grid grid-cols-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left: Upcoming Events */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Upcoming Campus Events
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Events scheduled for the upcoming weeks.</p>
            </div>
            <Link to="/admin/events" className="btn btn-outline btn-sm">
              Manage All Events →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.upcomingEvents?.map((evt) => (
              <div key={evt.id} style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.86rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{evt.name}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    {evt.date} • {evt.venue}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.84rem' }}>
                    {evt.registeredCount} / {evt.capacity}
                  </div>
                  <StatusBadge status={evt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Registrations Stream */}
        <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recent Student RSVPs
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Live stream of student pass registrations.</p>
            </div>
            <Link to="/admin/events" className="btn btn-outline btn-sm">
              Auditing View
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats?.recentRegistrations?.map((reg) => (
              <div key={reg.registrationId} style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.86rem'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{reg.studentName}</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    {reg.rollNumber} • {reg.eventName}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px'
                  }}>
                    {reg.eventCode}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {reg.registrationDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
