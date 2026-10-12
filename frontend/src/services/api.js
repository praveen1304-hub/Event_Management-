/**
 * Central API Client Config
 * CampusPulse - College Event Countdown & RSVP Tracker
 * Dynamically resolves API hostname to support localhost, 127.0.0.1, and local network Wi-Fi IPs
 */

export const getApiBaseUrl = () => {
  const host = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : 'localhost';
  return `http://${host}:5000/api`;
};

export const API_BASE_URL = getApiBaseUrl();

// Storage Keys for authentication tokens
export const STORAGE_KEYS = {
  HOST_AUTH: 'campuspulse_current_host_session',
  ADMIN_AUTH: 'campuspulse_current_admin_session'
};

export const AUTH_SESSION_CHANGED_EVENT = 'campuspulse:auth-session-changed';
export const AUTH_SESSION_EXPIRED_EVENT = 'campuspulse:auth-session-expired';

function getAuthorizationSession(endpoint) {
  if (endpoint.startsWith('/admin/')) {
    return { storageKey: STORAGE_KEYS.ADMIN_AUTH, role: 'admin' };
  }

  if (endpoint.startsWith('/host/')) {
    try {
      const hostSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.HOST_AUTH) || 'null');
      if (hostSession?.token) {
        return { storageKey: STORAGE_KEYS.HOST_AUTH, role: 'host', token: hostSession.token };
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.HOST_AUTH);
    }

    return { storageKey: STORAGE_KEYS.ADMIN_AUTH, role: 'admin' };
  }

  return null;
}

/**
 * Universal fetch wrapper for Flask API
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const authSession = getAuthorizationSession(endpoint);
  let token = authSession?.token;

  if (authSession && !token) {
    try {
      const session = JSON.parse(localStorage.getItem(authSession.storageKey) || 'null');
      token = session?.token || null;
    } catch (error) {
      localStorage.removeItem(authSession.storageKey);
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => ({ success: false, message: 'Invalid JSON response from server' }));

    if (!response.ok) {
      const errorMsg = result.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = result;

      if (response.status === 401 && authSession && token) {
        localStorage.removeItem(authSession.storageKey);
        window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT, {
          detail: { role: authSession.role }
        }));
      }

      throw err;
    }

    return result.data !== undefined ? result.data : result;
  } catch (error) {
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, error);
    throw error;
  }
}
