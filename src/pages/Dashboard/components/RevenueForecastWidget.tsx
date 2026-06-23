import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { TrendingUp, AutoAwesome } from '@mui/icons-material';

export default function RevenueForecastWidget({ forecast }: { forecast: any }) {
  const theme = useTheme();
  
  if (!forecast) return null;
  
  const progress = Math.min(100, (forecast.current / forecast.target) * 100);
  const predictedProgress = Math.min(100, (forecast.predicted / forecast.target) * 100);

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper', backgroundImage: 'none', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp color="success" />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Revenue Forecast</Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '1px' }}>CURRENT COLLECTION</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.5 }}>${(forecast.current / 1000).toFixed(1)}k</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '1px' }}>MONTHLY TARGET</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>${(forecast.target / 1000).toFixed(1)}k</Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', height: 12, borderRadius: 6, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', mb: 4, overflow: 'hidden' }}>
          {/* Predicted Progress (Ghost Bar) */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${predictedProgress}%`, bgcolor: 'primary.light', opacity: 0.3, transition: 'width 1s ease' }} />
          {/* Actual Progress */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progress}%`, bgcolor: 'primary.main', transition: 'width 1s ease', borderRadius: 6 }} />
        </Box>

        <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', gap: 2 }}>
          <AutoAwesome sx={{ color: '#a855f7' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#a855f7' }}>AI Prediction</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Based on current traffic trends, projected end-of-month revenue is <strong>${(forecast.predicted / 1000).toFixed(1)}k</strong>.
            </Typography>
          </Box>
        </Box>

      </CardContent>
    </Card>
  );
}
