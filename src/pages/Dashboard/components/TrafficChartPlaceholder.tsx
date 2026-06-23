import React from 'react';
import { Card, Box, Typography } from '@mui/material';

export default function TrafficChartPlaceholder() {
  return (
    <Card 
      sx={{ 
        height: 420, 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
          Traffic Volume Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Number of vehicles detected compared to last week
        </Typography>
      </Box>
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#F8F9FA',
          borderRadius: 2,
        }}
      >
        <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
          Chart Graphic Will Render Here
        </Typography>
      </Box>
    </Card>
  );
}
