import { Box, Grid } from '@mui/material';
import StatCard from './components/StatCard';
import TrafficChartPlaceholder from './components/TrafficChartPlaceholder';
import RecentViolationsPlaceholder from './components/RecentViolationsPlaceholder';
import { Speed as SpeedIcon, Warning as WarningIcon, DirectionsCar as CarIcon, Receipt as ReceiptIcon } from '@mui/icons-material';

export default function Dashboard() {
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
