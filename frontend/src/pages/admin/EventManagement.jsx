import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { EventTable } from '../../components/admin/EventTable';
import { Loading } from '../../components/common/Loading';
import { Toast } from '../../components/common/Toast';

export const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events for admin', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await eventApi.updateEventStatus(eventId, newStatus);
      setToastMessage({ message: `Event status changed to '${newStatus}'!`, type: 'success' });
      fetchEvents();
    } catch (err) {
      setToastMessage({ message: err.message || 'Status update failed.', type: 'error' });
    }
  };

  if (loading) return <Loading text="Loading college event directory..." fullHeight />;

  return (
    <div>
      <Toast
        message={toastMessage?.message}
        type={toastMessage?.type}
        onClose={() => setToastMessage(null)}
      />

      <AdminHeader
        title="College Event Governance"
        subtitle="Review, moderate, update statuses, or cancel events across all departments."
      />

      <EventTable
        events={events}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
