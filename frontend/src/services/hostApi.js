import { apiRequest, STORAGE_KEYS, AUTH_SESSION_CHANGED_EVENT } from './api';
import { initialHosts } from '../data/mockHosts';

export const hostApi = {
  // Host Login
  async login(email, password) {
    if (!email || !password) throw new Error('Please provide both email and password.');

    try {
      const response = await apiRequest('/auth/host/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
      const session = {
        id: response.host.id,
        name: response.host.name,
        email: response.host.email,
        department: response.host.department,
        organization: response.host.organization,
        role: response.host.role,
        token: response.token
      };

      localStorage.setItem(STORAGE_KEYS.HOST_AUTH, JSON.stringify(session));
      window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
      return session;
    } catch (e) {
      throw e;
    }
  },

  // Get Current Host Session
  getCurrentHost() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HOST_AUTH);
      const session = raw ? JSON.parse(raw) : null;
      if (session?.token && session?.id) return session;
      localStorage.removeItem(STORAGE_KEYS.HOST_AUTH);
      return null;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.HOST_AUTH);
      return null;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem(STORAGE_KEYS.HOST_AUTH);
  },

  // Get Host Dashboard Statistics
  async getHostDashboardStats(hostId) {
    try {
      const stats = await apiRequest('/host/dashboard');
      return stats;
    } catch (e) {
      throw e;
    }
  }
};
