import { Box, AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Traffic as TrafficIcon } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';

export default function CitizenLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/citizen')}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', display: 'flex' }}>
                <TrafficIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.5px' }}>
                ITMS Citizen Portal
              </Typography>
            </Box>
            <Button variant="outlined" color="inherit" onClick={() => navigate('/')}>
              Home
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 6, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Container>
      
      <Box component="footer" sx={{ py: 3, textAlign: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} City Traffic Police Department. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
