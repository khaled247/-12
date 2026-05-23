import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import { useApp } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import LandingPage from './pages/LandingPage';
import Appointments from './pages/Appointments';
import Services from './pages/Services';
import Login from './pages/Login';
import Staff from './pages/Staff';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Booking from './pages/Booking';
import Products from './pages/Products';
import BarberPage from './pages/BarberPage';
import BarberScreen from './pages/BarberScreen';
import MobileNav from './layouts/MobileNav';
import './index.css';
import ToastContainer from './components/ToastContainer';
import Reminders from './pages/Reminders';
import MyReceipts from './pages/MyReceipts';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  // use context for auth
  try {
    const { auth } = useApp();
    const isAuthenticated = auth?.isAuthenticated;
    const userRole = auth?.role;
    if (!isAuthenticated || userRole !== 'owner') return <Navigate to="/login" replace />;
    return children;
  } catch (e) {
    // If used outside provider or any error, fallback to redirect
    return <Navigate to="/login" replace />;
  }
};

// Admin Layout with Sidebar
const AdminLayout = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area" style={{ display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Customer Routes */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/receipts" element={<MyReceipts />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="customers" element={<Customers />} />
            <Route path="barber" element={<BarberPage />} />
            <Route path="barber/screen" element={<BarberScreen />} />
            <Route path="services" element={<Services />} />
            <Route path="products" element={<Products />} />
            <Route path="staff" element={<Staff />} />
            <Route path="finances" element={<Finances />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
