import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/adminApi';
import { AUTH_SESSION_CHANGED_EVENT, AUTH_SESSION_EXPIRED_EVENT } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => setAdmin(adminApi.getCurrentAdmin());
    const handleExpiredSession = (event) => {
      if (event.detail?.role === 'admin') setAdmin(null);
    };

    syncSession();
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    setLoading(false);

    return () => {
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession);
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    };
  }, []);

  const login = async (email, password) => {
    const session = await adminApi.login(email, password);
    setAdmin(session);
    return session;
  };

  const logout = () => {
    adminApi.logout();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAdminAuthenticated: !!admin,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
