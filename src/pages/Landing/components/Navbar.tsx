import { Box, Typography, Container, Button, AppBar, Toolbar } from '@mui/material';
import { Traffic as TrafficIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', height: 80 }}>
          
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'primary.main', display: 'flex', boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
                <TrafficIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </motion.div>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'white' }}>
              ITMS
            </Typography>
          </Box>

          {/* Center Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            <Button 
              onClick={() => navigate('/')} 
              sx={{ color: isCurrentPath('/') ? 'white' : 'text.secondary', fontWeight: 600, '&:hover': { color: 'white' } }}
            >
              Home
            </Button>
            <Button 
              onClick={() => navigate('/features')} 
              sx={{ color: isCurrentPath('/features') ? 'white' : 'text.secondary', fontWeight: 600, '&:hover': { color: 'white' } }}
            >
              Technology
            </Button>
            <Button 
              onClick={() => navigate('/about')} 
              sx={{ color: isCurrentPath('/about') ? 'white' : 'text.secondary', fontWeight: 600, '&:hover': { color: 'white' } }}
            >
              About
            </Button>
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/citizen')}
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
            >
              Citizen Portal
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => navigate('/dashboard')}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)' }}
            >
              Staff Login
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}
