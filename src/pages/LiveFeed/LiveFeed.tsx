import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, IconButton, Chip, CircularProgress, TextField } from '@mui/material';
import { Videocam as VideocamIcon, Fullscreen as FullscreenIcon, FiberManualRecord as RecordIcon } from '@mui/icons-material';
import { axiosClient } from '../../api/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Camera {
  id: string;
  name: string;
  status: 'LIVE' | 'OFFLINE';
  congestion_level: 'LOW' | 'MODERATE' | 'HIGH';
}

export default function LiveFeed() {
  const [customCameraUrl, setCustomCameraUrl] = useState<string>('0');
  const { data: cameras = [], isLoading: loading, error } = useQuery<Camera[], Error>({
    queryKey: ['cameras'],
    queryFn: async () => {
      const response = await axiosClient.get('/cameras', {
        params: { limit: 100 }
      });
      return response.data.items;
    },
    refetchInterval: 10000 // Refetch every 10 seconds for live feed
  });

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load live feeds: ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    // Explicitly tell backend to stop all camera streams when we leave the page
    return () => {
      cameras.forEach(cam => {
        axiosClient.post(`/cameras/${cam.id}/stop`).catch(() => {});
      });
    };
  }, [cameras]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  const handleFullscreen = (cameraId: string) => {
    const elem = document.getElementById(`video-container-${cameraId}`);
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Live Camera Feeds
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Real-time monitoring of all active traffic cameras
          </Typography>
          <TextField
            label="Mobile IP Camera URL (e.g. http://192.168.1.5:8080/video or '0' for webcam)"
            value={customCameraUrl}
            onChange={(e) => setCustomCameraUrl(e.target.value)}
            size="small"
            sx={{ width: 500 }}
          />
        </Box>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Chip
            icon={<RecordIcon sx={{ fontSize: 16 }} />}
            label="System Recording Active"
            color="error"
            variant="outlined"
            sx={{ fontWeight: 600, border: 1, borderColor: 'error.main' }}
          />
        </motion.div>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <Grid container spacing={3}>
            {cameras.map((camera, index) => (
              <Grid key={camera.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    height: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                {/* Video Placeholder Area */}
                <Box
                  id={`video-container-${camera.id}`}
                  sx={{
                    flexGrow: 1,
                    bgcolor: camera.status === 'OFFLINE' ? 'action.disabledBackground' : '#0F172A',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {camera.status === 'LIVE' ? (
                    index === 0 ? (
                      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                        <img 
                          src={`http://localhost:8000/api/cameras/${camera.id}/stream?url=${encodeURIComponent(customCameraUrl)}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt="Live Stream"
                        />
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', color: '#334155' }}>
                        <VideocamIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, opacity: 0.5 }}>
                          Video Stream Active
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                      CAMERA OFFLINE
                    </Typography>
                  )}

                  {/* Overlay tags */}
                  {camera.status === 'LIVE' && (
                    <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1 }}>
                      <Chip size="small" label="LIVE" color="error" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                      <Chip
                        size="small"
                        label={camera.congestion_level + ' Traffic'}
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          bgcolor: camera.congestion_level === 'HIGH' ? 'error.main' : camera.congestion_level === 'MODERATE' ? 'warning.main' : 'success.main',
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
                  <IconButton size="small" disabled={camera.status === 'OFFLINE'} onClick={() => handleFullscreen(camera.id)}>
                    <FullscreenIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}
    </Box>
  );
}
