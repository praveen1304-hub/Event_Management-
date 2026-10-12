import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarPlus, 
  QrCode, 
  LogOut, 
  ArrowLeft,
  Calendar,
  Users
} from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';

export const HostSidebar = () => {
  const { host, logout } = useHostAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/host/login');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Calendar size={18} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1
          }}>
            Event<span style={{ color: '#2563eb' }}>Tracker</span>
          </div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#2563eb',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Host Portal
          </span>
        </div>
      </div>

      {/* Host Profile Capsule */}
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.92rem',
          flexShrink: 0
        }}>
          {host?.name ? host.name.charAt(0).toUpperCase() : 'H'}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontSize: '0.86rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {host?.name || 'Event Host'}
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: '#64748b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {host?.organization || host?.department}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <NavLink
          to="/host/dashboard"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/host/events"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <CalendarDays size={18} />
          <span>My Events</span>
        </NavLink>

        <NavLink
          to="/host/events/create"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <CalendarPlus size={18} />
          <span>Create New Event</span>
        </NavLink>
      </nav>

      {/* Footer Utility Actions */}
      <div style={{
        padding: '1rem 0.75rem',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem'
      }}>
        <Link
          to="/events"
          className="sidebar-link"
          style={{ fontSize: '0.84rem' }}
        >
          <ArrowLeft size={16} />
          <span>Public Events View</span>
        </Link>

        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--danger)',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '0.84rem'
          }}
        >
          <LogOut size={16} />
          <span>Sign Out Host</span>
        </button>
      </div>
    </aside>
  );
};
