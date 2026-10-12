import React from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';

// Public Pages
import { Home } from '../pages/public/Home';
import { About } from '../pages/public/About';
import { Events } from '../pages/public/Events';
import { EventDetails } from '../pages/public/EventDetails';
import { Contact } from '../pages/public/Contact';

// Student Pages (No login required)
import { EventRegistration } from '../pages/student/EventRegistration';
import { EntryPassPage } from '../pages/student/EntryPassPage';

// Host Pages
import { HostLogin } from '../pages/host/HostLogin';
import { HostDashboard } from '../pages/host/HostDashboard';
import { HostEvents } from '../pages/host/HostEvents';
import { CreateEvent } from '../pages/host/CreateEvent';
import { EditEvent } from '../pages/host/EditEvent';
import { EventRegistrations } from '../pages/host/EventRegistrations';
import { QRScanner } from '../pages/host/QRScanner';

// Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { EventManagement } from '../pages/admin/EventManagement';
import { UserManagement } from '../pages/admin/UserManagement';

// Common Components & Layouts
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HostSidebar } from '../components/host/HostSidebar';
import { AdminSidebar } from '../components/admin/AdminSidebar';

// Contexts
import { useHostAuth } from '../context/HostAuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Loading } from '../components/common/Loading';

// ===================================================================
// 1. PUBLIC & STUDENT LAYOUT (WITH NAVBAR & FOOTER)
// ===================================================================
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ flex: '1 0 auto' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// ===================================================================
// 2. HOST PROTECTED LAYOUT
// ===================================================================
const HostLayout = () => {
  const { isHostAuthenticated, loading } = useHostAuth();
  const location = useLocation();

  if (loading) return <Loading text="Checking host credentials..." fullHeight />;

  if (!isHostAuthenticated) {
    return <Navigate to="/host/login" state={{ from: location }} replace />;
  }

  return (
    <div className="dashboard-shell">
      <HostSidebar />
      <div className="dashboard-body">
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ===================================================================
// 3. ADMIN PROTECTED LAYOUT
// ===================================================================
const AdminLayout = () => {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) return <Loading text="Checking administrator clearance..." fullHeight />;

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="dashboard-shell">
      <AdminSidebar />
      <div className="dashboard-body">
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ===================================================================
// 4. MAIN APPLICATION ROUTING TABLE
// ===================================================================
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Student Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/contact" element={<Contact />} />

        {/* Student Direct RSVP & Digital Pass (NO LOGIN) */}
        <Route path="/events/:eventId/register" element={<EventRegistration />} />
        <Route path="/entry-pass/:registrationId" element={<EntryPassPage />} />
      </Route>

      {/* Host Authentication */}
      <Route path="/host/login" element={<HostLogin />} />

      {/* Host Protected Dashboard */}
      <Route path="/host" element={<HostLayout />}>
        <Route index element={<Navigate to="/host/dashboard" replace />} />
        <Route path="dashboard" element={<HostDashboard />} />
        <Route path="events" element={<HostEvents />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/:eventId/edit" element={<EditEvent />} />
        <Route path="events/:eventId/registrations" element={<EventRegistrations />} />
        <Route path="events/:eventId/scanner" element={<QRScanner />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
