// ============================================================
// JIOS Padel & Coffee — App Router
// ============================================================

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import BookingPage from './pages/BookingPage';
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminBookingsPage from './pages/admin/BookingsPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Auto scroll to top on page change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// Public layout wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-200 overflow-x-hidden w-full relative">
      <ScrollToTop />
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* ── Public Routes ── */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/schedule"
          element={
            <PublicLayout>
              <SchedulePage />
            </PublicLayout>
          }
        />
        <Route
          path="/booking"
          element={
            <PublicLayout>
              <BookingPage />
            </PublicLayout>
          }
        />

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
