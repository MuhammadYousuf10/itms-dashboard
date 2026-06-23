import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Auth Pages
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// Dashboard Components
import { Box, Grid } from '@mui/material';
import StatCard from '../pages/Dashboard/components/StatCard';
import TrafficChartPlaceholder from '../pages/Dashboard/components/TrafficChartPlaceholder';
import RecentViolationsPlaceholder from '../pages/Dashboard/components/RecentViolationsPlaceholder';
import { Speed as SpeedIcon, Warning as WarningIcon, DirectionsCar as CarIcon, Receipt as ReceiptIcon } from '@mui/icons-material';

import ProtectedRoute from './ProtectedRoute';

// Temporary Dashboard Component (extracted from App.tsx)
function DashboardView() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
              title="Total Vehicles" 
              value="12,458" 
              icon={<CarIcon sx={{ fontSize: 32 }} />} 
              color="primary"
              trend="+12%"
              isPositive={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
              title="Avg Speed" 
              value="64 km/h" 
              icon={<SpeedIcon sx={{ fontSize: 32 }} />} 
              color="success"
              trend="-2.4%"
              isPositive={true}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
              title="Violations" 
              value="142" 
              icon={<WarningIcon sx={{ fontSize: 32 }} />} 
              color="warning"
              trend="+18%"
              isPositive={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard 
              title="Challans Issued" 
              value="128" 
              icon={<ReceiptIcon sx={{ fontSize: 32 }} />} 
              color="error"
              trend="+15%"
              isPositive={false}
            />
          </Grid>
        </Grid>
      </Box>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <TrafficChartPlaceholder />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentViolationsPlaceholder />
        </Grid>
      </Grid>
    </Box>
  );
}

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
                <DashboardView />
              </MainLayout>
            } 
          />
          {/* Add more protected routes here (e.g., /live, /challans) */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
