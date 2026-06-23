import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Auth Pages
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// Dashboard Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import LiveFeed from '../pages/LiveFeed/LiveFeed';
import Challans from '../pages/Challans/Challans';
import Settings from '../pages/Settings/Settings';

import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />} 
        />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/" 
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            } 
          />
          <Route 
            path="/live" 
            element={
              <MainLayout>
                <LiveFeed />
              </MainLayout>
            } 
          />
          <Route 
            path="/challans" 
            element={
              <MainLayout>
                <Challans />
              </MainLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } 
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
