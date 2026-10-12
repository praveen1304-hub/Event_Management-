import React, { useState, useEffect } from 'react';
import { UserPlus, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { UserTable } from '../../components/admin/UserTable';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { Toast } from '../../components/common/Toast';

export const UserManagement = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Add Host Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newHost, setNewHost] = useState({
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    organization: '',
    phone: '',
    password: 'host123'
  });

  // View Host Details Modal
  const [selectedHost, setSelectedHost] = useState(null);

  const fetchHosts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllOrganizers();
      setHosts(data);
    } catch (err) {
      console.error('Failed to load hosts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const handleUpdateStatus = async (hostId, newStatus) => {
    try {
      await adminApi.updateOrganizerStatus(hostId, newStatus);
      setToastMessage({ message: `Organizer status updated to '${newStatus}'!`, type: 'success' });
      fetchHosts();
    } catch (err) {
      setToastMessage({ message: err.message || 'Status update failed.', type: 'error' });
    }
  };

  const handleCreateHost = async (e) => {
    e.preventDefault();
    if (!newHost.name.trim() || !newHost.email.trim()) {
      setToastMessage({ message: 'Name and Email are required.', type: 'error' });
      return;
    }

    setAddLoading(true);
    try {
      await adminApi.createOrganizer(newHost);
      setToastMessage({ message: 'New Event Host onboarded successfully!', type: 'success' });
      setIsAddModalOpen(false);
      setNewHost({
        name: '',
        email: '',
        department: 'Computer Science & Engineering',
        organization: '',
        phone: '',
        password: 'host123'
      });
      fetchHosts();
    } catch (err) {
      setToastMessage({ message: err.message || 'Failed to create host.', type: 'error' });
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <Loading text="Loading faculty organizer directory..." fullHeight />;

  return (
    <div>
      <Toast
        message={toastMessage?.message}
        type={toastMessage?.type}
        onClose={() => setToastMessage(null)}
      />

      <AdminHeader
        title="Event Organizer Oversight"
        subtitle="Manage faculty hosts, departmental coordinators, and platform access accounts."
        action={
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Onboard New Host
          </Button>
        }
      />

      {/* Info notice about student logins */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        fontSize: '0.84rem',
        color: '#1e40af',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        💡 <strong>Note on User Architecture:</strong> Students register directly for individual events and do NOT have login accounts. This directory manages authenticated Faculty Hosts / Department Organizers.
      </div>

      <UserTable
        hosts={hosts}
        onUpdateStatus={handleUpdateStatus}
        onViewHostDetails={(h) => setSelectedHost(h)}
      />

      {/* 1. ONBOARD NEW HOST MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard Faculty / Event Host"
        maxWidth="520px"
      >
        <form onSubmit={handleCreateHost}>
          <Input
            label="Full Name & Title"
            placeholder="e.g. Dr. Rajesh Sundaram"
            value={newHost.name}
            onChange={(e) => setNewHost({ ...newHost, name: e.target.value })}
            required
          />

          <Input
            label="College Email"
            type="email"
            placeholder="e.g. rajesh.s@college.edu"
            value={newHost.email}
            onChange={(e) => setNewHost({ ...newHost, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                value={newHost.department}
                onChange={(e) => setNewHost({ ...newHost, department: e.target.value })}
                className="form-select"
              >
                <option value="Computer Science & Engineering">CSE</option>
                <option value="Information Technology">IT</option>
                <option value="AI & Data Science">AI & DS</option>
                <option value="Electronics & Communication">ECE</option>
                <option value="Electrical Engineering">EEE</option>
                <option value="Mechanical Engineering">Mech</option>
                <option value="Civil Engineering">Civil</option>
                <option value="Student Cultural Council">Cultural Council</option>
              </select>
            </div>

            <Input
              label="Club / Society"
              placeholder="e.g. Robotics Club"
              value={newHost.organization}
              onChange={(e) => setNewHost({ ...newHost, organization: e.target.value })}
            />
          </div>

          <Input
            label="Contact Phone"
            placeholder="+91 98765 00000"
            value={newHost.phone}
            onChange={(e) => setNewHost({ ...newHost, phone: e.target.value })}
          />

          <Input
            label="Initial Temporary Password"
            type="password"
            value={newHost.password}
            onChange={(e) => setNewHost({ ...newHost, password: e.target.value })}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={addLoading}>
              Create Host Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. VIEW HOST PROFILE MODAL */}
      <Modal
        isOpen={!!selectedHost}
        onClose={() => setSelectedHost(null)}
        title="Organizer Account Profile"
        maxWidth="480px"
        footer={
          <Button variant="outline" size="sm" onClick={() => setSelectedHost(null)}>
            Close
          </Button>
        }
      >
        {selectedHost && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <img
                src={selectedHost.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={selectedHost.name}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedHost.name}</h3>
                <div style={{ color: '#2563eb', fontWeight: 600 }}>{selectedHost.department}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{selectedHost.organization}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Email:</span>
              <strong style={{ color: 'var(--text-main)' }}>{selectedHost.email}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Phone:</span>
              <span>{selectedHost.phone || 'N/A'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Total Events Created:</span>
              <strong style={{ color: '#2563eb' }}>{selectedHost.totalEventsCreated || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Total RSVPs Received:</span>
              <strong style={{ color: '#059669' }}>{selectedHost.totalRegistrationsReceived || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Account Status:</span>
              <span className={`badge ${selectedHost.status === 'active' ? 'badge-confirmed' : 'badge-cancelled'}`}>
                {selectedHost.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
