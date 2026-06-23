import { Box, Typography, Container, Button, AppBar, Toolbar } from '@mui/material';
import { Traffic as TrafficIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', height: 70 }}>
          
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#ffffff', display: 'flex' }}>
              <TrafficIcon sx={{ color: '#000000', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.04em', color: '#ffffff' }}>
              ITMS
            </Typography>
          </Box>

          {/* Center Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            <Button disableRipple onClick={() => navigate('/')} sx={{ color: isCurrentPath('/') ? '#ffffff' : '#a1a1aa', fontWeight: 500, fontSize: '0.875rem', '&:hover': { color: '#ffffff', bgcolor: 'transparent' } }}>
              Home
            </Button>
            <Button disableRipple onClick={() => navigate('/features')} sx={{ color: isCurrentPath('/features') ? '#ffffff' : '#a1a1aa', fontWeight: 500, fontSize: '0.875rem', '&:hover': { color: '#ffffff', bgcolor: 'transparent' } }}>
              Technology
            </Button>
            <Button disableRipple onClick={() => navigate('/about')} sx={{ color: isCurrentPath('/about') ? '#ffffff' : '#a1a1aa', fontWeight: 500, fontSize: '0.875rem', '&:hover': { color: '#ffffff', bgcolor: 'transparent' } }}>
              About
            </Button>
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              onClick={() => navigate('/dashboard')}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, color: '#ffffff', fontSize: '0.875rem', fontWeight: 500 }}
            >
              Log in
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/citizen')}
              sx={{ bgcolor: '#ffffff', color: '#000000', fontSize: '0.875rem', fontWeight: 500, borderRadius: 2, px: 2, py: 0.5, '&:hover': { bgcolor: '#f4f4f5' } }}
            >
              Public Portal
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
