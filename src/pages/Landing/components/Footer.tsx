import { Box, Typography, Container, IconButton } from '@mui/material';
import { Traffic as TrafficIcon, Twitter, LinkedIn, GitHub } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0b1120', color: 'text.secondary', py: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }, gap: 4, mb: 6 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <TrafficIcon sx={{ color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
                ITMS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 300, mb: 3 }}>
              Intelligent Traffic Management System. Securing city streets with AI-driven analytics and automated enforcement.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><Twitter /></IconButton>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><LinkedIn /></IconButton>
              <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}><GitHub /></IconButton>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 2, textTransform: 'uppercase' }}>
              Portals
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Citizen Access</Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Staff Dashboard</Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Police Node</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 2, textTransform: 'uppercase' }}>
              Company
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>About Us</Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Technology</Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Careers</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'white', mb: 2, textTransform: 'uppercase' }}>
              Legal
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Privacy Policy</Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Terms of Service</Typography>
            <Typography variant="body2" sx={{ mb: 1, cursor: 'pointer', '&:hover': { color: 'white' } }}>Accessibility</Typography>
          </Box>
        </Box>

        <Typography variant="body2" align="center" sx={{ pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          © {new Date().getFullYear()} City Traffic Department. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
