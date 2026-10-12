import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSidebar = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
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
          background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Calendar size={20} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            lineHeight: 1
          }}>
            Event<span style={{ color: '#1d4ed8' }}>Tracker</span>
          </div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#1d4ed8',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            College Governance
          </span>
        </div>
      </div>

      {/* Admin Profile Capsule */}
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
          backgroundColor: '#eff6ff',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.92rem',
          flexShrink: 0
        }}>
          A
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
            {admin?.name || 'Administrator'}
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: '#1d4ed8',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {admin?.department || 'Academic Dean Office'}
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ padding: '1rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <NavLink
          to="/admin/dashboard"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Platform Overview</span>
        </NavLink>

        <NavLink
          to="/admin/events"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck size={18} />
          <span>Event Management</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>Organizer Management</span>
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
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
