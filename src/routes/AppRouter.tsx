import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';

// Layouts (Keep static since they wrap everything)
import MainLayout from '../layouts/MainLayout';
import CitizenLayout from '../layouts/CitizenLayout';
import ProtectedRoute from './ProtectedRoute';

// Eagerly Loaded Public Pages
import Landing from '../pages/Landing/Landing';
import About from '../pages/Landing/About';
import Features from '../pages/Landing/Features';

// Eagerly Loaded Auth Pages
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// Lazy Loaded Dashboard Pages
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const LiveFeed = lazy(() => import('../pages/LiveFeed/LiveFeed'));
const Challans = lazy(() => import('../pages/Challans/Challans'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const MapDashboard = lazy(() => import('../pages/Map/MapDashboard'));
const CameraManagement = lazy(() => import('../pages/Cameras/CameraManagement'));
const Analytics = lazy(() => import('../pages/Analytics/Analytics'));
const UserManagement = lazy(() => import('../pages/Users/UserManagement'));

// Lazy Loaded Citizen Pages
const Verify = lazy(() => import('../pages/Citizen/Verify'));
const MyChallans = lazy(() => import('../pages/Citizen/MyChallans'));

import SimpleLoader from '../components/common/SimpleLoader';

function AnimatedRoutes() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const isOperator = user?.role === 'OPERATOR';

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<SimpleLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />}
          />
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
          />

          {/* Public Landing Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />

          {/* Public Citizen Routes */}
          <Route element={<CitizenLayout />}>
            <Route 
              path="/citizen" 
              element={
                <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                  <Verify />
                </Suspense>
              } 
            />
            <Route 
              path="/citizen/challans" 
              element={
                <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                  <MyChallans />
                </Suspense>
              } 
            />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                    <Dashboard />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/live"
              element={
                <MainLayout>
                  <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                    <LiveFeed />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/challans"
              element={
                <MainLayout>
                  <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                    <Challans />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/settings"
              element={
                isOperator ? <Navigate to="/dashboard" replace /> :
                  <MainLayout>
                    <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                      <Settings />
                    </Suspense>
                  </MainLayout>
              }
            />
            <Route
              path="/map"
              element={
                <MainLayout>
                  <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                    <MapDashboard />
                  </Suspense>
                </MainLayout>
              }
            />
            <Route
              path="/cameras"
              element={
                isOperator ? <Navigate to="/dashboard" replace /> :
                  <MainLayout>
                    <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                      <CameraManagement />
                    </Suspense>
                  </MainLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                isOperator ? <Navigate to="/dashboard" replace /> :
                  <MainLayout>
                    <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                      <Analytics />
                    </Suspense>
                  </MainLayout>
              }
            />
            <Route
              path="/team"
              element={
                isOperator ? <Navigate to="/dashboard" replace /> :
                  <MainLayout>
                    <Suspense fallback={<Box sx={{ minHeight: '80vh' }} />}>
                      <UserManagement />
                    </Suspense>
                  </MainLayout>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
