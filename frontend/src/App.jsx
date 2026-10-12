import React from 'react';
import { HostAuthProvider } from './context/HostAuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <HostAuthProvider>
      <AdminAuthProvider>
        <AppRoutes />
      </AdminAuthProvider>
    </HostAuthProvider>
  );
}

export default App;
