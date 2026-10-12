import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Users, 
  QrCode, 
  Edit3, 
  Eye, 
  ExternalLink,
  Trash2,
  CalendarCheck
} from 'lucide-react';
import { useHostAuth } from '../../context/HostAuthContext';
import { eventApi } from '../../services/eventApi';
import { HostHeader } from '../../components/host/HostHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Toast } from '../../components/common/Toast';

export const HostEvents = () => {
  const { host } = useHostAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchHostEvents = async () => {
    if (!host) return;
    setLoading(true);
    try {
      const data = await eventApi.getHostEvents(host.id);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostEvents();
  }, [host]);

  // Handle status update
  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventApi.updateHostEventStatus(eventId, newStatus);
      setToastMessage({ message: `Event status updated to '${newStatus}'!`, type: 'success' });
      fetchHostEvents();
    } catch (err) {
      setToastMessage({ message: err.message || 'Failed to update status.', type: 'error' });
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await eventApi.deleteEvent(deleteTarget.id);
      setToastMessage({ message: 'Event deleted successfully.', type: 'success' });
      setDeleteTarget(null);
      fetchHostEvents();
    } catch (err) {
      setToastMessage({ message: err.message || 'Failed to delete event.', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );

      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  if (loading) return <Loading text="Loading your event catalog..." fullHeight />;

  return (
    <div>
      <Toast
        message={toastMessage?.message}
        type={toastMessage?.type}
        onClose={() => setToastMessage(null)}
      />

      <HostHeader
        title="Event Management"
        subtitle="Manage details, schedules, registrations, and scanner check-in for your events."
        action={
          <Link to="/host/events/create">
            <Button variant="primary" size="sm" icon={<PlusCircle size={16} />}>
              Create New Event
            </Button>
          </Link>
        }
      />

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search my events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84rem' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.84rem', width: 'auto' }}
          >
            <option value="All">All Statuses ({events.length})</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description={search ? 'No events matched your search query.' : 'You have not created any events matching this status.'}
          actionLabel="Create Event"
          onAction={() => window.location.href = '/host/events/create'}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Name & Category</th>
                <th>Date & Time</th>
                <th>Campus Venue</th>
                <th>RSVPs / Cap</th>
                <th>Status</th>
                <th>Manage Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id}>
                  {/* Name & Category */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{evt.name}</div>
                    <span className="badge badge-category" style={{ fontSize: '0.7rem', marginTop: '0.2rem' }}>
                      {evt.category}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{evt.date}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{evt.startTime} {evt.endTime ? `- ${evt.endTime}` : ''}</div>
                  </td>

                  {/* Venue */}
                  <td style={{ fontSize: '0.84rem', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.venue}
                  </td>

                  {/* Registered */}
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

                  {/* Status Dropdown */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <StatusBadge status={evt.status} />
                      <select
                        value={evt.status}
                        onChange={(e) => handleStatusChange(evt.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.2rem 0.4rem', fontSize: '0.72rem', width: 'auto' }}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Live">Live</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {/* Attendees */}
                      <Link
                        to={`/host/events/${evt.id}/registrations`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="View Registered Students"
                      >
                        <Users size={13} /> ({evt.registeredCount})
                      </Link>

                      {/* QR Scanner */}
                      <Link
                        to={`/host/events/${evt.id}/scanner`}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="Scan Entry Passes"
                      >
                        <QrCode size={13} />
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

                      {/* Public Page View */}
                      <Link
                        to={`/events/${evt.id}`}
                        target="_blank"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="Open Public Page"
                      >
                        <ExternalLink size={13} />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(evt)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}
                        title="Delete Event"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete '${deleteTarget?.name}'? ${deleteTarget?.registeredCount > 0 ? `Note: This event already has ${deleteTarget?.registeredCount} student registrations.` : ''}`}
        confirmText="Delete Event"
        loading={deleteLoading}
      />
    </div>
  );
};
