import React from 'react';
import { Card, CardContent, Typography, Box, alpha, useTheme } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  trend?: string;
  isPositive?: boolean;
}

export default function StatCard({ title, value, icon, color, trend, isPositive = true }: StatCardProps) {
  const theme = useTheme();
  const mainColor = theme.palette[color].main;
  const trendColor = isPositive ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        transition: 'transform 0.2s', 
        '&:hover': { 
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      <CardContent sx={{ p: 3, pb: '24px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            color="text.secondary" 
            variant="subtitle2" 
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
          <Box sx={{ color: mainColor }}>
            {icon}
          </Box>
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary',
            mb: 1
          }}
        >
          {value}
        </Typography>
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                bgcolor: alpha(trendColor, 0.1),
                color: trendColor,
                px: 1,
                py: 0.25,
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-block'
              }}
            >
              {trend}
            </Box>
            <Typography variant="caption" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
