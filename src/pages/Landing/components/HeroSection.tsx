import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', pt: 10 }}>
      {/* Background Video/Image simulation */}
      <Box 
        sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 0
        }} 
      />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, #0f172a 0%, rgba(15,23,42,0.8) 50%, #0f172a 100%)', zIndex: 1 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ maxWidth: 800 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '2px', mb: 2, display: 'block' }}>
              NEXT-GENERATION CITY INFRASTRUCTURE
            </Typography>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, letterSpacing: '-2px', fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1, color: 'white' }}>
              Intelligent Traffic <br />
              <Typography component="span" variant="inherit" sx={{ background: 'linear-gradient(to right, #38bdf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Management System
              </Typography>
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 6, fontWeight: 400, maxWidth: 600, lineHeight: 1.6 }}>
              Securing our city streets using advanced AI, computer vision, and real-time analytics. Automated violation detection, seamless citizen portal, and a powerful operations dashboard.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate('/citizen')}
                sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 8px 20px rgba(56, 189, 248, 0.3)' }}
              >
                Access Citizen Portal
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                sx={{ px: 4, py: 1.5, borderRadius: 2, fontSize: '1.1rem', fontWeight: 700, color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
              >
                How It Works
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
