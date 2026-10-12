import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Image, MapPin, Users } from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';
import { eventApi } from '../../services/eventApi';
import { eventCategories } from '../../data/mockEvents';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { HostHeader } from '../../components/host/HostHeader';
import { Loading } from '../../components/common/Loading';

export const EditEvent = () => {
  const { eventId } = useParams();
  const { host } = useHostAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Workshop',
    description: '',
    poster: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    registrationDeadline: '',
    capacity: 100,
    status: 'Upcoming',
    rulesText: ''
  });

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        const evt = await eventApi.getEventById(eventId);
        setFormData({
          name: evt.name || '',
          category: evt.category || 'Workshop',
          description: evt.description || '',
          poster: evt.poster || '',
          date: evt.date || '',
          startTime: evt.startTime || '',
          endTime: evt.endTime || '',
          venue: evt.venue || '',
          registrationDeadline: evt.registrationDeadline || '',
          capacity: evt.capacity || 100,
          status: evt.status || 'Upcoming',
          rulesText: Array.isArray(evt.rules) ? evt.rules.join('\n') : (evt.rules || '')
        });
      } catch (err) {
        setError(err.message || 'Failed to load event for editing.');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Event Name is required.');
      return;
    }
    if (!formData.date) {
      setError('Event Date is required.');
      return;
    }
    if (!formData.venue?.trim()) {
      setError('Event Venue is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const rulesArray = formData.rulesText
        .split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);

      await eventApi.updateEvent(eventId, {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        poster: formData.poster.trim(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue.trim(),
        registrationDeadline: formData.registrationDeadline,
        capacity: parseInt(formData.capacity, 10) || 100,
        status: formData.status,
        rules: rulesArray
      });

      navigate('/host/events');
    } catch (err) {
      setError(err.message || 'Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading text="Loading event details..." fullHeight />;

  return (
    <div>
      <HostHeader
        title="Edit Event"
        subtitle={`Updating details for '${formData.name}'`}
        action={
          <Link to="/host/events" className="btn btn-outline btn-sm">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        }
      />

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
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
          
          <form onSubmit={handleUpdate}>
            
            {/* General Info */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                1. General Event Information
              </h2>

              <Input
                label="Event Name / Title"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />

              <div className="grid grid-cols-2" style={{ gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="form-select"
                  >
                    {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="form-select"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <Input
                label="Poster Image URL"
                value={formData.poster}
                onChange={(e) => handleChange('poster', e.target.value)}
                icon={<Image size={16} />}
              />

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="form-textarea"
                  required
                />
              </div>
            </div>

            {/* Schedule & Venue */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                2. Schedule & Venue
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
                  label="End Time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3" style={{ gap: '1.25rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <Input
                    label="Campus Venue"
                    value={formData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    icon={<MapPin size={16} />}
                    required
                  />
                </div>

                <Input
                  label="Capacity (Seats)"
                  type="number"
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
              />
            </div>

            {/* Rules */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                3. Rules (One per line)
              </h2>

              <div className="form-group">
                <textarea
                  rows={4}
                  value={formData.rulesText}
                  onChange={(e) => handleChange('rulesText', e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Submit */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '1.5rem'
            }}>
              <Link to="/host/events" className="btn btn-outline">
                Cancel
              </Link>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                icon={<Save size={16} />}
              >
                Save Changes
              </Button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
