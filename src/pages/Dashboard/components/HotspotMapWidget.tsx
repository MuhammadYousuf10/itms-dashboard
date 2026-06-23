import { Box, Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { Map, LocationOn } from '@mui/icons-material';

export default function HotspotMapWidget({ hotspots }: { hotspots: any[] }) {
  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Map color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Geographical Hotspots</Typography>
      </Box>
      <CardContent sx={{ p: 0 }}>
        {/* Mock Map Background */}
        <Box sx={{ height: 160, bgcolor: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '20%', left: '30%', color: 'error.main' }}><LocationOn fontSize="large" /></Box>
          <Box sx={{ position: 'absolute', top: '50%', left: '70%', color: 'warning.main' }}><LocationOn fontSize="medium" /></Box>
          <Box sx={{ position: 'absolute', top: '70%', left: '40%', color: 'error.main' }}><LocationOn fontSize="large" /></Box>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.secondary' }}>High Activity Zones</Typography>
          {hotspots?.map((spot, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{spot.name}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: spot.intensity > 80 ? 'error.main' : 'warning.main' }}>{spot.intensity}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={spot.intensity} color={spot.intensity > 80 ? 'error' : 'warning'} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
