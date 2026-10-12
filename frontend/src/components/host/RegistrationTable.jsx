import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, Download, ExternalLink, Filter } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export const RegistrationTable = ({
  registrations = [],
  onToggleAttendance,
  eventName = 'Event'
}) => {
  const [search, setSearch] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('all'); // 'all', 'attended', 'not_attended'

  // Filtered registrations
  const filteredList = useMemo(() => {
    return registrations.filter((r) => {
      // Search
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        r.studentName.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.eventCode.toLowerCase().includes(q)
      );

      // Attendance Filter
      let matchesAttendance = true;
      if (attendanceFilter === 'attended') matchesAttendance = r.attended === true;
      else if (attendanceFilter === 'not_attended') matchesAttendance = r.attended === false;

      return matchesSearch && matchesAttendance;
    });
  }, [registrations, search, attendanceFilter]);

  // Export CSV Helper
  const handleExportCSV = () => {
    if (!filteredList.length) return;

    const headers = ['Registration ID', 'Event Code', 'Student Name', 'Roll Number', 'Department', 'Year', 'Email', 'Registered At', 'Attended', 'Attendance Time'];
    const rows = filteredList.map(r => [
      `"${r.registrationId}"`,
      `"${r.eventCode}"`,
      `"${r.studentName}"`,
      `"${r.rollNumber}"`,
      `"${r.department}"`,
      `"${r.year}"`,
      `"${r.email}"`,
      `"${r.registrationDate}"`,
      r.attended ? '"YES"' : '"NO"',
      `"${r.attendedAt || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${eventName.replace(/\s+/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attendedCount = registrations.filter(r => r.attended).length;

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
        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by student, roll no, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.86rem' }}
          />
        </div>

        {/* Filter & Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem' }}>
            <Filter size={15} style={{ color: '#64748b' }} />
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="form-select"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.84rem', width: 'auto' }}
            >
              <option value="all">All ({registrations.length})</option>
              <option value="attended">Attended ({attendedCount})</option>
              <option value="not_attended">Not Yet Marked ({registrations.length - attendedCount})</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={!filteredList.length}
            icon={<Download size={15} />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Registrations Table */}
      {filteredList.length === 0 ? (
        <EmptyState
          title="No Registrations Found"
          description={search ? 'No student records match your active search.' : 'No students have registered for this event yet.'}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Roll Number</th>
                <th>Department & Year</th>
                <th>Event Pass Code</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((reg) => (
                <tr key={reg.registrationId}>
                  {/* Student */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{reg.studentName}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{reg.email}</div>
                  </td>

                  {/* Roll No */}
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.84rem',
                      color: '#0f172a'
                    }}>
                      {reg.rollNumber}
                    </span>
                  </td>

                  {/* Dept / Year */}
                  <td>
                    <div style={{ fontSize: '0.84rem' }}>{reg.department}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{reg.year}</div>
                  </td>

                  {/* Event Code */}
                  <td>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      backgroundColor: '#eff6ff',
                      padding: '0.2rem 0.45rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {reg.eventCode}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {reg.registrationDate}
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge status={reg.status} />
                  </td>

                  {/* Attendance Status */}
                  <td>
                    {reg.attended ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.82rem'
                        }}>
                          <CheckCircle2 size={15} /> Present
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{reg.attendedAt || 'Marked'}</span>
                      </div>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.82rem'
                      }}>
                        <XCircle size={15} /> Not Marked
                      </span>
                    )}
                  </td>

                  {/* Toggle & Entry Pass Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Button
                        variant={reg.attended ? 'outline' : 'primary'}
                        size="sm"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                        onClick={() => onToggleAttendance && onToggleAttendance(reg.registrationId)}
                      >
                        {reg.attended ? 'Mark Absent' : 'Mark Present'}
                      </Button>

                      <Link
                        to={`/entry-pass/${reg.registrationId}`}
                        target="_blank"
                        title="View Entry Pass"
                        style={{
                          padding: '0.3rem',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)'
                        }}
                      >
                        <ExternalLink size={14} />
                      </Link>
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
