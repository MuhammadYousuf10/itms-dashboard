import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          width: '100%',
          maxWidth: 480,
          borderRadius: 4,
          boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.04)',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #00D4B2 0%, #3B82F6 100%)',
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
            ITMS Pro
          </Typography>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {subtitle}
          </Typography>
        )}

        {children}
      </Paper>
    </Box>
  );
}
