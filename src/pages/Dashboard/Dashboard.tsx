import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StatCard from './components/StatCard';
import TrafficChart from './components/TrafficChart';
import RecentViolations from './components/RecentViolations';
import SystemHealth from './components/SystemHealth';
import ViolationTypeChart from './components/ViolationTypeChart';
import LiveFeedWidget from './components/LiveFeedWidget';
import HotspotMapWidget from './components/HotspotMapWidget';
import QuickDisputesWidget from './components/QuickDisputesWidget';
import RevenueForecastWidget from './components/RevenueForecastWidget';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton';
import { Speed as SpeedIcon, Warning as WarningIcon, DirectionsCar as CarIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await axiosClient.get('/dashboard/stats');
      return res.data;
    },
    refetchInterval: 30000, // Refresh dashboard every 30 seconds
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load dashboard data. Please make sure the backend is running.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Box sx={{ mb: 4, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div variants={itemVariants}>
                <StatCard 
                  title="Total Vehicles" 
                  value={data.totalVehicles.toLocaleString()} 
                  icon={<CarIcon sx={{ fontSize: 32 }} />} 
                  color="primary"
                  trend="+12%"
                  isPositive={true}
                />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div variants={itemVariants}>
                <StatCard 
                  title="Avg Speed" 
                  value={`${data.avgSpeed} km/h`} 
                  icon={<SpeedIcon sx={{ fontSize: 32 }} />} 
                  color="success"
                  trend="-2.4%"
                  isPositive={true}
                />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div variants={itemVariants}>
                <StatCard 
                  title="Violations" 
                  value={data.violations.toLocaleString()} 
                  icon={<WarningIcon sx={{ fontSize: 32 }} />} 
                  color="warning"
                  trend="+18%"
                  isPositive={false}
                />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <motion.div variants={itemVariants}>
                <StatCard 
                  title="Challans Issued" 
                  value={data.challansIssued.toLocaleString()} 
                  icon={<ReceiptIcon sx={{ fontSize: 32 }} />} 
                  color="error"
                  trend="+15%"
                  isPositive={false}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <TrafficChart data={data.chartData} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <RecentViolations violations={data.recentViolations} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <LiveFeedWidget feeds={data.liveFeeds} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <QuickDisputesWidget disputes={data.quickDisputes} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <SystemHealth health={data.systemHealth} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <ViolationTypeChart data={data.violationTypes} />
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <RevenueForecastWidget forecast={data.revenueForecast} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12 }}>
              <motion.div variants={itemVariants} style={{ height: '100%' }}>
                <HotspotMapWidget hotspots={data.hotspots} />
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
}
