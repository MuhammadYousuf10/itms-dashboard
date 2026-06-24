import { Box, Card, CardContent, Typography, LinearProgress, alpha, useTheme } from '@mui/material';
import { Map, LocationOn } from '@mui/icons-material';

export default function HotspotMapWidget({ hotspots }: { hotspots: any[] }) {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 4, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Map color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Geographical Hotspots</Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>
        {/* Premium Mock Map Background */}
        <Box sx={{ 
          height: 180, 
          position: 'relative', 
          overflow: 'hidden',
          bgcolor: theme.palette.mode === 'dark' ? '#0f172a' : '#f8fafc',
          backgroundImage: `radial-gradient(${theme.palette.divider} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}>
          {/* Animated Pulsing Pins */}
          {[
            { top: '25%', left: '35%', color: 'error.main', delay: '0s' },
            { top: '55%', left: '75%', color: 'warning.main', delay: '1s' },
            { top: '65%', left: '45%', color: 'error.main', delay: '2s' }
          ].map((pin, i) => (
            <Box key={i} sx={{ position: 'absolute', top: pin.top, left: pin.left, color: pin.color }}>
              <Box sx={{ 
                position: 'absolute', width: 24, height: 24, borderRadius: '50%', 
                bgcolor: alpha(theme.palette[pin.color.split('.')[0] as 'error'|'warning'].main, 0.4),
                animation: `hotspotPulse 2s infinite ${pin.delay}`,
                left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                '@keyframes hotspotPulse': {
                  '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                  '100%': { transform: 'translate(-50%, -50%) scale(3)', opacity: 0 }
                }
              }} />
              <LocationOn sx={{ position: 'relative', zIndex: 1, transform: 'translate(-50%, -100%)', fontSize: 28 }} />
            </Box>
          ))}
          <Box sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'background.paper', px: 1, borderRadius: 1, opacity: 0.8 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem' }}>LIVE TRACKING</Typography>
          </Box>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 3, fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '1px' }}>High Activity Zones</Typography>
          {hotspots?.length > 0 ? hotspots.map((spot, i) => (
            <Box key={i} sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-end' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{spot.name}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: spot.intensity > 80 ? 'error.main' : 'warning.main', bgcolor: alpha(theme.palette[spot.intensity > 80 ? 'error' : 'warning'].main, 0.1), px: 1, py: 0.25, borderRadius: 1 }}>
                  {spot.intensity}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={spot.intensity} 
                color={spot.intensity > 80 ? 'error' : 'warning'} 
                sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} 
              />
            </Box>
          )) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>No significant hotspot data available.</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
