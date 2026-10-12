import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Calendar, Shield, Users, Menu, X } from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { host, isHostAuthenticated } = useHostAuth();
  const { admin, isAdminAuthenticated } = useAdminAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <Link to="/" onClick={closeMobileMenu} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              Event<span style={{ color: '#2563eb' }}>Tracker</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
              College Event & RSVP Tracker
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.85rem', margin: 0 }}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.85rem', margin: 0 }}
          >
            About
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.85rem', margin: 0 }}
          >
            Events
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{ padding: '0.45rem 0.85rem', margin: 0 }}
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Action Logins: Host Login & Admin Login (NO Student Login) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }} className="desktop-nav">
          {/* Host Portal Button */}
          {isHostAuthenticated ? (
            <Link to="/host/dashboard" className="btn btn-outline btn-sm">
              <Users size={15} style={{ color: '#2563eb' }} />
              <span>Host: {host.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <Link to="/host/login" className="btn btn-outline btn-sm">
              <Users size={15} />
              <span>Host Login</span>
            </Link>
          )}

          {/* Admin Portal Button */}
          {isAdminAuthenticated ? (
            <Link to="/admin/dashboard" className="btn btn-primary btn-sm">
              <Shield size={15} />
              <span>Admin Panel</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="btn btn-primary btn-sm">
              <Shield size={15} />
              <span>Admin Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-toggle-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'none'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border-light)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <Link to="/" onClick={closeMobileMenu} className="sidebar-link">Home</Link>
          <Link to="/about" onClick={closeMobileMenu} className="sidebar-link">About</Link>
          <Link to="/events" onClick={closeMobileMenu} className="sidebar-link">Events Directory</Link>
          <Link to="/contact" onClick={closeMobileMenu} className="sidebar-link">Contact</Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              to={isHostAuthenticated ? '/host/dashboard' : '/host/login'}
              onClick={closeMobileMenu}
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start' }}
            >
              <Users size={16} />
              <span>{isHostAuthenticated ? 'Host Dashboard' : 'Host Organizer Login'}</span>
            </Link>
            <Link
              to={isAdminAuthenticated ? '/admin/dashboard' : '/admin/login'}
              onClick={closeMobileMenu}
              className="btn btn-primary"
              style={{ justifyContent: 'flex-start' }}
            >
              <Shield size={16} />
              <span>{isAdminAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};
