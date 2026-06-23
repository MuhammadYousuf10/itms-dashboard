import { Box, Typography, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for offline cameras
const offlineIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Camera {
  id: string;
  name: string;
  status: 'LIVE' | 'OFFLINE';
  congestion_level: 'LOW' | 'MODERATE' | 'HIGH';
  latitude: number | null;
  longitude: number | null;
}

export default function MapDashboard() {
  const { data: cameras, isLoading } = useQuery<Camera[]>({
    queryKey: ['cameras'],
    queryFn: async () => {
      const res = await axiosClient.get('/cameras');
      return res.data.items;
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Default center (New York if our mock data is there)
  const center: [number, number] = [40.730610, -73.935242];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', mt: 2, borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cameras?.map((cam) => {
          if (!cam.latitude || !cam.longitude) return null;
          return (
            <Marker 
              key={cam.id} 
              position={[cam.latitude, cam.longitude]}
              icon={cam.status === 'OFFLINE' ? offlineIcon : new L.Icon.Default()}
            >
              <Popup>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{cam.name}</Typography>
                <Typography variant="body2">ID: {cam.id}</Typography>
                <Typography variant="body2" color={cam.status === 'LIVE' ? 'success.main' : 'error.main'}>
                  Status: {cam.status}
                </Typography>
                <Typography variant="body2">Congestion: {cam.congestion_level}</Typography>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
}
