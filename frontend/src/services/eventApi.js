import { apiRequest } from './api';
import { initialEvents, eventCategories } from '../data/mockEvents';

export const eventApi = {
  // Public Events with Search and Filter
  async getPublicEvents({ search = '', category = 'All', dateFilter = 'all' } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search && search.trim()) params.append('search', search.trim());
      if (dateFilter && dateFilter !== 'all') params.append('dateFilter', dateFilter);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const events = await apiRequest(`/events${qs}`);
      return events;
    } catch (e) {
      console.warn('[eventApi] Falling back to local events cache:', e.message);
      // Fallback
      let events = initialEvents.filter(ev => ev.status !== 'Draft');
      if (category && category !== 'All') events = events.filter(ev => ev.category === category);
      return events;
    }
  },

  // Featured Events for Landing Page Hero
  async getFeaturedEvents() {
    try {
      const events = await this.getPublicEvents({ dateFilter: 'upcoming' });
      return events.slice(0, 4);
    } catch (e) {
      return initialEvents.slice(0, 4);
    }
  },

  // Get Single Event by ID
  async getEventById(eventId) {
    try {
      // If eventId contains 'evt-' prefix, extract numeric id
      const cleanId = String(eventId).replace('evt-', '');
      const event = await apiRequest(`/events/${cleanId}`);
      return event;
    } catch (e) {
      const found = initialEvents.find(ev => String(ev.id) === String(eventId));
      if (found) return found;
      throw new Error(`Event with ID '${eventId}' not found.`);
    }
  },

  // Get Logged-in Host's Events
  async getHostEvents(hostId) {
    try {
      const events = await apiRequest('/host/events');
      return events;
    } catch (e) {
      return initialEvents.filter(ev => ev.hostId === hostId || ev.host_id === hostId);
    }
  },

  // Create New Event
  async createEvent(eventData, host) {
    const payload = {
      event_name: eventData.name || eventData.event_name,
      category: eventData.category,
      description: eventData.description,
      poster: eventData.poster,
      event_date: eventData.date || eventData.event_date,
      start_time: eventData.startTime || eventData.start_time,
      end_time: eventData.endTime || eventData.end_time || '',
      venue: eventData.venue,
      registration_deadline: eventData.registrationDeadline || eventData.registration_deadline,
      capacity: parseInt(eventData.capacity, 10) || 100,
      status: eventData.status || 'Upcoming',
      rules: eventData.rules || []
    };

    return await apiRequest('/host/events', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Update Event
  async updateEvent(eventId, updatedFields) {
    const cleanId = String(eventId).replace('evt-', '');
    const payload = {
      event_name: updatedFields.name || updatedFields.event_name,
      category: updatedFields.category,
      description: updatedFields.description,
      poster: updatedFields.poster,
      event_date: updatedFields.date || updatedFields.event_date,
      start_time: updatedFields.startTime || updatedFields.start_time,
      end_time: updatedFields.endTime || updatedFields.end_time,
      venue: updatedFields.venue,
      registration_deadline: updatedFields.registrationDeadline || updatedFields.registration_deadline,
      capacity: updatedFields.capacity ? parseInt(updatedFields.capacity, 10) : undefined,
      status: updatedFields.status,
      rules: updatedFields.rules
    };

    return await apiRequest(`/host/events/${cleanId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  // Update Event Status (Upcoming, Live, Completed, Cancelled)
  async updateEventStatus(eventId, newStatus) {
    const cleanId = String(eventId).replace('evt-', '');
    return await apiRequest(`/admin/events/${cleanId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
  },

  // Update status for an event owned by the authenticated host
  async updateHostEventStatus(eventId, newStatus) {
    const cleanId = String(eventId).replace('evt-', '');
    return await apiRequest(`/host/events/${cleanId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });
  },

  // Delete Event
  async deleteEvent(eventId) {
    const cleanId = String(eventId).replace('evt-', '');
    return await apiRequest(`/host/events/${cleanId}`, {
      method: 'DELETE'
    });
  },

  // Get Categories
  getCategories() {
    return eventCategories;
  }
};
