import { Box, Typography, Grid, Card, IconButton, Chip } from '@mui/material';
import { Videocam as VideocamIcon, Fullscreen as FullscreenIcon, FiberManualRecord as RecordIcon } from '@mui/icons-material';

const cameras = [
  { id: 'CAM-01', name: 'Highway 1 North', status: 'Live', congestion: 'High' },
  { id: 'CAM-02', name: 'City Center Junction', status: 'Live', congestion: 'Moderate' },
  { id: 'CAM-03', name: 'Westside Boulevard', status: 'Live', congestion: 'Low' },
  { id: 'CAM-04', name: 'East Toll Plaza', status: 'Offline', congestion: 'N/A' },
  { id: 'CAM-05', name: 'Airport Road', status: 'Live', congestion: 'High' },
  { id: 'CAM-06', name: 'Downtown Main', status: 'Live', congestion: 'Moderate' },
];

export default function LiveFeed() {
  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Live Camera Feeds
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time monitoring of all active traffic cameras
          </Typography>
        </Box>
        <Chip 
          icon={<RecordIcon sx={{ fontSize: 16 }} />} 
          label="System Recording Active" 
          color="error" 
          variant="outlined" 
          sx={{ fontWeight: 600, border: 1, borderColor: 'error.main' }}
        />
      </Box>

      <Grid container spacing={3}>
        {cameras.map((camera) => (
          <Grid key={camera.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card 
              sx={{ 
                height: 280, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                boxShadow: 'none',
                overflow: 'hidden'
              }}
            >
              {/* Video Placeholder Area */}
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  bgcolor: camera.status === 'Offline' ? 'action.disabledBackground' : '#0F172A',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {camera.status === 'Live' ? (
                  <Box sx={{ textAlign: 'center', color: '#334155' }}>
                    <VideocamIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.5 }}>
                      Video Stream Active
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                    CAMERA OFFLINE
                  </Typography>
                )}
                
                {/* Overlay tags */}
                {camera.status === 'Live' && (
                  <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                    <Chip size="small" label="LIVE" color="error" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                    <Chip 
                      size="small" 
                      label={camera.congestion + ' Traffic'} 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.65rem', 
                        fontWeight: 700,
                        bgcolor: camera.congestion === 'High' ? 'error.main' : camera.congestion === 'Moderate' ? 'warning.main' : 'success.main',
                        color: '#FFF'
                      }} 
                    />
                  </Box>
                )}
              </Box>

              {/* Camera Info Footer */}
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'divider' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {camera.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {camera.id}
                  </Typography>
                </Box>
                <IconButton size="small" disabled={camera.status === 'Offline'}>
                  <FullscreenIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
