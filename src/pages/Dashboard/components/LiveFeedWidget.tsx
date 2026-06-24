import { Box, Card, CardContent, Typography } from '@mui/material';
import { Videocam, FiberManualRecord } from '@mui/icons-material';

export default function LiveFeedWidget({ feeds }: { feeds: any[] }) {
  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Videocam color="primary" /> Camera Matrix
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
          <FiberManualRecord sx={{ 
            fontSize: 14, 
            animation: 'livePulse 1.5s infinite',
            '@keyframes livePulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.3 },
              '100%': { opacity: 1 }
            }
          }} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>LIVE</Typography>
        </Box>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {feeds?.map((feed, i) => (
            <Box key={i} sx={{ position: 'relative', height: 120, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2, overflow: 'hidden', border: '1px solid #333' }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
              <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FiberManualRecord sx={{ fontSize: 10, color: 'error.main' }} />
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.6)', px: 1, borderRadius: 1 }}>{feed.id}</Typography>
              </Box>
              <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, left: 8, color: 'white', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.6)', px: 1, borderRadius: 1 }}>{feed.location}</Typography>
              <Typography variant="caption" sx={{ position: 'absolute', bottom: 8, right: 8, color: '#38bdf8', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.6)', px: 1, borderRadius: 1 }}>{feed.fps} FPS</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
