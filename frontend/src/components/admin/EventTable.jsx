import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, Edit3, XCircle, CheckCircle, Eye } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { eventCategories } from '../../data/mockEvents';

export const EventTable = ({
  events = [],
  onUpdateStatus,
  onEditEvent
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      // Search
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        e.name.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q) ||
        e.hostName.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );

      // Category
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;

      // Status
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [events, search, categoryFilter, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Search & Filter Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search all college events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
          />
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.84rem', width: 'auto' }}
            >
              <option value="All">All Categories</option>
              {eventCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.84rem', width: 'auto' }}
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Matching Query"
          description="Try broadening your category or status filters to view events."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Name & Category</th>
                <th>Organizer / Host</th>
                <th>Date & Schedule</th>
                <th>Venue</th>
                <th>RSVPs / Cap</th>
                <th>Status</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => (
                <tr key={evt.id}>
                  {/* Name & Category */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{evt.name}</div>
                    <span className="badge badge-category" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                      {evt.category}
                    </span>
                  </td>

                  {/* Organizer */}
                  <td>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{evt.organizer}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Host: {evt.hostName}</div>
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{evt.date}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{evt.startTime} - {evt.endTime || 'End TBA'}</div>
                  </td>

                  {/* Venue */}
                  <td style={{ fontSize: '0.84rem', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {evt.venue}
                  </td>

                  {/* Registrations */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {/* View Public Page */}
                      <Link
                        to={`/events/${evt.id}`}
                        target="_blank"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                        title="View Public Page"
                      >
                        <Eye size={13} />
                      </Link>

                      {/* Status changer dropdown */}
                      <select
                        value={evt.status}
                        onChange={(e) => onUpdateStatus && onUpdateStatus(evt.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Live">Live</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
