import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <div className="main-content container" style={{ padding: '3rem 1.25rem 5rem' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
        <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
          CAMPUS SUPPORT & COORDINATION
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Contact College Event Team
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
          Have questions about an upcoming workshop, symposium, or student registration pass? Reach out to our campus event coordinators.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        
        {/* Left Side: Contact Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
              Campus Office & Locations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                    Main Campus Location
                  </strong>
                  <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                    Dean of Student Affairs Complex, Administrative Block, Main Campus
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                    Email Support
                  </strong>
                  <span style={{ color: '#64748b' }}>
                    eventtrackerGCT@gmail.com
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                    Phone Helpline
                  </strong>
                  <span style={{ color: '#64748b' }}>
                    +91 (0) 44 2235 8000 (Ext: 204)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.15rem' }}>
                    Working Hours
                  </strong>
                  <span style={{ color: '#64748b' }}>
                    Monday – Friday: 9:00 AM – 5:00 PM
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            fontSize: '0.86rem',
            color: '#1e40af'
          }}>
            <strong>Student RSVP Notice:</strong> Students do not need to register an account. You can RSVP directly on any active event card in the Events Directory.
          </div>

        </div>

        {/* Right Side: Message Form */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Send an Inquiry
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Fill out the form below and the faculty coordinator team will respond to your registered email.
          </p>

          {submitted && (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              color: '#065f46',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle2 size={18} style={{ color: '#059669' }} />
              <span>Your message has been sent successfully to the event team!</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Your Full Name"
              placeholder="e.g. Praveen Kumar"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />

            <Input
              label="College Email"
              type="email"
              placeholder="e.g. student@college.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />

            <Input
              label="Subject"
              placeholder="e.g. Question regarding Workshop entry pass"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              required
            />

            <div className="form-group">
              <label className="form-label">
                Your Message <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Write your query or message here..."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              loading={sending}
              icon={<Send size={16} />}
            >
              Send Message
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};
