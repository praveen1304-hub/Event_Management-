import React, { useState, useMemo } from 'react';
import { Search, ShieldAlert, ShieldCheck, UserX, UserCheck, Eye, Plus } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export const UserTable = ({
  hosts = [],
  onUpdateStatus,
  onViewHostDetails
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHosts = useMemo(() => {
    return hosts.filter((h) => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        h.name.toLowerCase().includes(q) ||
        h.email.toLowerCase().includes(q) ||
        h.department.toLowerCase().includes(q) ||
        (h.organization && h.organization.toLowerCase().includes(q))
      );

      const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [hosts, search, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Toolbar */}
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
            placeholder="Search hosts by name, dept, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.84rem', fontWeight: 600 }}>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.84rem', width: 'auto' }}
          >
            <option value="all">All Organizers ({hosts.length})</option>
            <option value="active">Active Only</option>
            <option value="deactivated">Deactivated Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredHosts.length === 0 ? (
        <EmptyState
          title="No Organizers Found"
          description="No host organizers match your current search criteria."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Organizer Name</th>
                <th>Email & Phone</th>
                <th>Department & Club</th>
                <th>Role</th>
                <th>Events & RSVPs</th>
                <th>Status</th>
                <th>Account Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHosts.map((h) => (
                <tr key={h.id}>
                  {/* Name & Avatar */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={h.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={h.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{h.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Joined {h.createdDate}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>{h.email}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{h.phone || 'No phone'}</div>
                  </td>

                  {/* Dept & Organization */}
                  <td>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{h.department}</div>
                    <div style={{ fontSize: '0.74rem', color: '#2563eb' }}>{h.organization || 'Department Host'}</div>
                  </td>

                  {/* Role */}
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      {h.role}
                    </span>
                  </td>

                  {/* Events & RSVPs stats */}
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      {h.totalEventsCreated || 0} Events Created
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {h.totalRegistrationsReceived || 0} Total RSVPs
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge status={h.status} />
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {/* View Details */}
                      <button
                        onClick={() => onViewHostDetails && onViewHostDetails(h)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        title="View Host Profile"
                      >
                        <Eye size={13} /> View
                      </button>

                      {/* Toggle status */}
                      {h.status === 'active' ? (
                        <button
                          onClick={() => onUpdateStatus && onUpdateStatus(h.id, 'deactivated')}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#d97706' }}
                          title="Deactivate Host"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus && onUpdateStatus(h.id, 'active')}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#059669' }}
                          title="Activate Host"
                        >
                          Activate
                        </button>
                      )}

                      {/* Block button */}
                      {h.status !== 'blocked' && (
                        <button
                          onClick={() => onUpdateStatus && onUpdateStatus(h.id, 'blocked')}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          title="Block Access"
                        >
                          Block
                        </button>
                      )}
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
