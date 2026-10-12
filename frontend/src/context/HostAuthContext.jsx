import React, { createContext, useContext, useState, useEffect } from 'react';
import { hostApi } from '../services/hostApi';
import { AUTH_SESSION_CHANGED_EVENT, AUTH_SESSION_EXPIRED_EVENT } from '../services/api';

const HostAuthContext = createContext(null);

export const HostAuthProvider = ({ children }) => {
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncSession = () => setHost(hostApi.getCurrentHost());
    const handleExpiredSession = (event) => {
      if (event.detail?.role === 'host') setHost(null);
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
    const session = await hostApi.login(email, password);
    setHost(session);
    return session;
  };

  const logout = () => {
    hostApi.logout();
    setHost(null);
  };

  return (
    <HostAuthContext.Provider
      value={{
        host,
        isHostAuthenticated: !!host,
        login,
        logout,
        loading
      }}
    >
      {children}
    </HostAuthContext.Provider>
  );
};

export const useHostAuth = () => {
  const context = useContext(HostAuthContext);
  if (!context) {
    throw new Error('useHostAuth must be used within a HostAuthProvider');
  }
  return context;
};
