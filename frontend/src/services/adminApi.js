import { apiRequest, STORAGE_KEYS, AUTH_SESSION_CHANGED_EVENT } from './api';
import { initialAdmins } from '../data/mockAdmins';

export const adminApi = {
  // Admin Login
  async login(email, password) {
    if (!email || !password) throw new Error('Please provide both email and password.');

    try {
      const response = await apiRequest('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      localStorage.removeItem(STORAGE_KEYS.HOST_AUTH);
      const session = {
        id: response.admin.id,
        name: response.admin.name,
        email: response.admin.email,
        department: response.admin.department,
        role: response.admin.role,
        token: response.token
      };

      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(session));
      window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
      return session;
    } catch (e) {
      throw e;
    }
  },

  // Get Current Admin Session
  getCurrentAdmin() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      const session = raw ? JSON.parse(raw) : null;
      if (session?.token && session?.id) return session;
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      return null;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },

  // Overall Platform Statistics
  async getAdminDashboardStats() {
    return await apiRequest('/admin/dashboard');
  },

  async getAllEvents() {
    return await apiRequest('/admin/events');
  },

  // Organizer / Host Management
  async getAllOrganizers() {
    return await apiRequest('/admin/hosts');
  },

  async updateOrganizerStatus(hostId, newStatus) {
    const cleanId = String(hostId).replace('host-', '');
    return await apiRequest(`/admin/hosts/${cleanId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
  },

  async createOrganizer(hostData) {
    return await apiRequest('/admin/hosts', {
      method: 'POST',
      body: JSON.stringify(hostData)
    });
  },

  async updateOrganizer(hostId, hostData) {
    const cleanId = String(hostId).replace('host-', '');
    return await apiRequest(`/admin/hosts/${cleanId}`, {
      method: 'PUT',
      body: JSON.stringify(hostData)
    });
  }
};
