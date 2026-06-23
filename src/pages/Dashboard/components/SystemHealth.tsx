import { Box, Card, CardContent, Typography, CircularProgress, useTheme } from '@mui/material';
import { Memory, Storage, Videocam } from '@mui/icons-material';

interface HealthProps {
  edgeTpu: number;
  cameraUptime: number;
  dbLatency: number;
}

interface HealthItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  unit?: string;
  themeMode: 'light' | 'dark';
}

const HealthItem = ({ label, value, icon, color, unit = '%', themeMode }: HealthItemProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress 
        variant="determinate" 
        value={100} 
        size={80} 
        thickness={4} 
        sx={{ color: themeMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} 
      />
      <CircularProgress 
        variant="determinate" 
        value={unit === '%' ? value : 100} 
        size={80} 
        thickness={4} 
        sx={{ color, position: 'absolute', left: 0 }} 
      />
      <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </Box>
    </Box>
    <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>{value}{unit}</Typography>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
);

export default function SystemHealth({ health }: { health: HealthProps }) {
  const theme = useTheme();



  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>System Health</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
          <HealthItem 
            label="Edge TPU Load" 
            value={health?.edgeTpu || 0} 
            icon={<Memory sx={{ color: theme.palette.primary.main }} />} 
            color={theme.palette.primary.main} 
            themeMode={theme.palette.mode}
          />
          <HealthItem 
            label="Camera Uptime" 
            value={health?.cameraUptime || 0} 
            icon={<Videocam sx={{ color: theme.palette.success.main }} />} 
            color={theme.palette.success.main} 
            themeMode={theme.palette.mode}
          />
          <HealthItem 
            label="DB Latency" 
            value={health?.dbLatency || 0} 
            unit="ms"
            icon={<Storage sx={{ color: theme.palette.warning.main }} />} 
            color={theme.palette.warning.main} 
            themeMode={theme.palette.mode}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
