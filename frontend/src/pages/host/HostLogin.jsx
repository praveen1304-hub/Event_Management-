import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const HostLogin = () => {
  const [email, setEmail] = useState('host@campuspulse.com');
  const [password, setPassword] = useState('CampusPulse@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useHostAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/host/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Host login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail('host@campuspulse.com');
    setPassword('CampusPulse@2026!');
    setError(null);
  };

  return (
    <div className="main-content" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.25rem',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-50)',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '1px solid #bfdbfe'
          }}>
            <Users size={26} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            Event Host Login
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Sign in to manage your events, attendees, and mark QR attendance.
          </p>
        </div>

        {/* Error Notice */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.84rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
            <div>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <Input
            label="Host / Faculty Email"
            type="email"
            placeholder="host@campuspulse.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={16} />}
            required
          />

          <Input
            label="Host Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={16} />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            loading={loading}
          >
            <span>Sign In to Host Portal</span>
            <ArrowRight size={16} />
          </Button>
        </form>

        {/* Demo Autofill Helper */}
        <div style={{
          marginTop: '1.75rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Demo Host Credentials</div>
            <div style={{ color: '#64748b', fontSize: '0.76rem' }}>host@campuspulse.com / CampusPulse@2026!</div>
          </div>
          <button
            type="button"
            onClick={handleAutofill}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
          >
            Auto-Fill
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.82rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            ← Back to Public College Events
          </Link>
        </div>

      </div>
    </div>
  );
};
