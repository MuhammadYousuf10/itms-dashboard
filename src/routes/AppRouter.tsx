import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

// Layouts & Public Pages
import MainLayout from '../layouts/MainLayout';
import Landing from '../pages/Landing/Landing';
import About from '../pages/Landing/About';
import Features from '../pages/Landing/Features';

// Auth Pages
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// Dashboard Pages
import Dashboard from '../pages/Dashboard/Dashboard';
import LiveFeed from '../pages/LiveFeed/LiveFeed';
import Challans from '../pages/Challans/Challans';
import Settings from '../pages/Settings/Settings';
import MapDashboard from '../pages/Map/MapDashboard';
import CameraManagement from '../pages/Cameras/CameraManagement';
import Analytics from '../pages/Analytics/Analytics';
import UserManagement from '../pages/Users/UserManagement';

import ProtectedRoute from './ProtectedRoute';

// Citizen Pages
import CitizenLayout from '../layouts/CitizenLayout';
import Verify from '../pages/Citizen/Verify';
import MyChallans from '../pages/Citizen/MyChallans';

function AnimatedRoutes() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  const isOperator = user?.role === 'OPERATOR';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <PageTransition><Login /></PageTransition>} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <PageTransition><SignUp /></PageTransition>} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <PageTransition><ForgotPassword /></PageTransition>} 
        />

        {/* Public Landing Routes */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/features" element={<PageTransition><Features /></PageTransition>} />

        {/* Public Citizen Routes */}
        <Route element={<CitizenLayout />}>
          <Route path="/citizen" element={<PageTransition><Verify /></PageTransition>} />
          <Route path="/citizen/challans" element={<PageTransition><MyChallans /></PageTransition>} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/dashboard" 
            element={
              <MainLayout>
                <PageTransition><Dashboard /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/live" 
            element={
              <MainLayout>
                <PageTransition><LiveFeed /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/challans" 
            element={
              <MainLayout>
                <PageTransition><Challans /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              isOperator ? <Navigate to="/dashboard" replace /> :
              <MainLayout>
                <PageTransition><Settings /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/map" 
            element={
              <MainLayout>
                <PageTransition><MapDashboard /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/cameras" 
            element={
              isOperator ? <Navigate to="/dashboard" replace /> :
              <MainLayout>
                <PageTransition><CameraManagement /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              isOperator ? <Navigate to="/dashboard" replace /> :
              <MainLayout>
                <PageTransition><Analytics /></PageTransition>
              </MainLayout>
            } 
          />
          <Route 
            path="/team" 
            element={
              isOperator ? <Navigate to="/dashboard" replace /> :
              <MainLayout>
                <PageTransition><UserManagement /></PageTransition>
              </MainLayout>
            } 
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
