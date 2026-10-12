import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CalendarPlus, ArrowLeft, Image, Clock, MapPin, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';
import { eventApi } from '../../services/eventApi';
import { eventCategories } from '../../data/mockEvents';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { HostHeader } from '../../components/host/HostHeader';

export const CreateEvent = () => {
  const { host } = useHostAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Workshop',
    description: '',
    poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    date: '',
    startTime: '10:00',
    endTime: '16:00',
    venue: '',
    registrationDeadline: '',
    capacity: 100,
    rulesText: '1. Bring your College ID Card for entry verification.\n2. Arrive at least 15 minutes before the scheduled start time.\n3. Digital entry pass QR code must be shown at the venue.'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSave = async (status = 'Upcoming') => {
    // Validation
    if (!formData.name?.trim()) {
      setError('Event Name is required.');
      return;
    }
    if (!formData.description?.trim()) {
      setError('Event Description is required.');
      return;
    }
    if (!formData.date) {
      setError('Event Date is required.');
      return;
    }
    if (!formData.startTime) {
      setError('Start Time is required.');
      return;
    }
    if (!formData.venue?.trim()) {
      setError('Event Venue is required.');
      return;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError('Capacity must be at least 1 attendee.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rulesArray = formData.rulesText
        .split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);

      await eventApi.createEvent({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        poster: formData.poster.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue.trim(),
        registrationDeadline: formData.registrationDeadline || formData.date,
        capacity: parseInt(formData.capacity, 10) || 100,
        rules: rulesArray,
        status: status
      }, host);

      navigate('/host/events');
    } catch (err) {
      setError(err.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <HostHeader
        title="Create New Event"
        subtitle="Schedule an internal college workshop, seminar, presentation, competition, or fest."
        action={
          <Link to="/host/events" className="btn btn-outline btn-sm">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        }
      />

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSave('Upcoming'); }}>
            
            {/* 1. Basic Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                1. General Event Information
              </h2>

              <Input
                label="Event Name / Title"
                placeholder="e.g. AI & Robotics Hands-on Masterclass"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />

              <div className="grid grid-cols-2" style={{ gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    Category <span style={{ color: 'var(--danger)' }}>*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="form-select"
                    required
                  >
                    {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <Input
                  label="Poster Image URL"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.poster}
                  onChange={(e) => handleChange('poster', e.target.value)}
                  icon={<Image size={16} />}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Detailed Description & Agenda <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain event objectives, prerequisites, target students, speakers, and schedule..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="form-textarea"
                  required
                />
              </div>
            </div>

            {/* 2. Schedule & Venue */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                2. Schedule, Venue & Capacity
              </h2>

              <div className="grid grid-cols-3" style={{ gap: '1.25rem' }}>
                <Input
                  label="Event Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />

                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                />

                <Input
                  label="End Time (Optional)"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3" style={{ gap: '1.25rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input
                    label="Campus Venue / Hall"
                    placeholder="e.g. CS Seminar Hall, Block 3"
                    value={formData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    icon={<MapPin size={16} />}
                    required
                  />
                </div>

                <Input
                  label="Max Capacity (Seats)"
                  type="number"
                  placeholder="100"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  icon={<Users size={16} />}
                  required
                />
              </div>

              <Input
                label="Registration Deadline Date"
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                helperText="After this date, students will no longer be able to RSVP for the event."
              />
            </div>

            {/* 3. Event Rules */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                3. Rules & Guidelines (One per line)
              </h2>

              <div className="form-group">
                <textarea
                  rows={4}
                  placeholder="1. College ID Card is required at entry.&#10;2. Arrive 15 minutes before the event start.&#10;3. Laptops required for coding track."
                  value={formData.rulesText}
                  onChange={(e) => handleChange('rulesText', e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '1.5rem'
            }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSave('Draft')}
                disabled={loading}
              >
                Save as Draft
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={<CalendarPlus size={16} />}
              >
                Publish Event
              </Button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
