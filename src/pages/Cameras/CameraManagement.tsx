import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';
import { CheckCircle as CheckIcon, Error as ErrorIcon, Speed as SpeedIcon, DirectionsCar as CarIcon, Warning as WarningIcon } from '@mui/icons-material';

interface Camera {
  id: string;
  name: string;
  status: 'LIVE' | 'OFFLINE';
  congestion_level: 'LOW' | 'MODERATE' | 'HIGH';
  latitude: number | null;
  longitude: number | null;
}

export default function CameraManagement() {
  const { data: cameras, isLoading } = useQuery<Camera[]>({
    queryKey: ['cameras'],
    queryFn: async () => {
      const res = await axiosClient.get('/cameras');
      return res.data;
    },
  });

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            Camera Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage all ANPR cameras across the network
          </Typography>
        </Box>
      </Box>

      <Card sx={{ border: 1, borderColor: 'divider', boxShadow: 'none' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Camera ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Location Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Congestion Level</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>GPS Coordinates</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cameras?.map((cam) => (
                  <TableRow key={cam.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{cam.id}</TableCell>
                    <TableCell>{cam.name}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={cam.status === 'LIVE' ? <CheckIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
                        label={cam.status} 
                        color={cam.status === 'LIVE' ? 'success' : 'error'} 
                        size="small" 
                        sx={{ fontWeight: 700, borderRadius: '8px', px: 0.5, py: 1.5 }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={
                          cam.congestion_level === 'LOW' ? <SpeedIcon fontSize="small" /> : 
                          cam.congestion_level === 'MODERATE' ? <CarIcon fontSize="small" /> : <WarningIcon fontSize="small" />
                        }
                        label={cam.congestion_level + ' TRAFFIC'} 
                        color={
                          cam.congestion_level === 'LOW' ? 'success' : 
                          cam.congestion_level === 'MODERATE' ? 'warning' : 'error'
                        } 
                        size="small" 
                        variant="outlined"
                        sx={{ borderWidth: 2, fontWeight: 700, borderRadius: '8px', px: 0.5, py: 1.5 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      {cam.latitude && cam.longitude 
                        ? `${cam.latitude.toFixed(4)}, ${cam.longitude.toFixed(4)}` 
                        : 'Not Set'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}
