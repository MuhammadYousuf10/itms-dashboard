import { Box, Typography, Button, Container } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', pt: 10, overflow: 'hidden' }}>
      
      {/* Parallax Floating Orbs */}
      <motion.div style={{ y: y1, opacity }}>
        <Box className="animate-float" sx={{ position: 'absolute', top: '10%', left: '15%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0 }} />
      </motion.div>
      <motion.div style={{ y: y2, opacity }}>
        <Box className="animate-float-delayed" sx={{ position: 'absolute', bottom: '10%', right: '15%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 0 }} />
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 6 }}>
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 0.5, borderRadius: 50, border: '1px solid rgba(56,189,248,0.3)', bgcolor: 'rgba(56,189,248,0.05)', mb: 4, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(56,189,248,0.1)' } }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#38bdf8', boxShadow: '0 0 10px #38bdf8', mr: 1, animation: 'pulse 2s infinite' }} />
                <Typography sx={{ color: '#38bdf8', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '1px' }}>
                  ITMS 2.0 IS LIVE
                </Typography>
              </Box>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5.5rem' }, lineHeight: 1.1 }}>
                Next-Gen <br />
                <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.3))' }}>
                  City Mobility
                </span>
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <Typography sx={{ color: '#94a3b8', mb: 6, fontWeight: 400, maxWidth: 600, mx: { xs: 'auto', md: 0 }, fontSize: { xs: '1.125rem', md: '1.25rem' }, lineHeight: 1.6 }}>
                Experience the future of traffic enforcement. AI-powered ANPR cameras, instant violation processing, and a highly transparent citizen resolution portal.
              </Typography>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')} sx={{ py: 1.5, px: 4, fontSize: '1rem' }}>
                  Admin Workspace
                </Button>
                <Button variant="outlined" onClick={() => navigate('/citizen')} sx={{ py: 1.5, px: 4, fontSize: '1rem', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: '#fff' } }}>
                  Citizen Portal
                </Button>
              </Box>
            </motion.div>
          </Box>

          <Box sx={{ flex: 1, display: { xs: 'none', lg: 'block' }, position: 'relative' }}>
            {/* 3D-like floating composition */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotateX: [0, 5, 0], rotateY: [0, -5, 0] }} 
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ perspective: 1000 }}
            >
              <Box className="glass-panel" sx={{ position: 'relative', width: '100%', height: 500, borderRadius: 6, p: 4, boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 40px rgba(56,189,248,0.2)' }}>
                <Box sx={{ height: '40%', borderRadius: 4, background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(37,99,235,0.2) 100%)', mb: 3, border: '1px solid rgba(56,189,248,0.3)', position: 'relative', overflow: 'hidden' }}>
                  <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 3, height: '45%' }}>
                  <Box sx={{ flex: 1, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }} />
                  <Box sx={{ flex: 1, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }} />
                </Box>
              </Box>
            </motion.div>
            
            {/* Secondary floating element */}
            <motion.div 
              animate={{ y: [0, 20, 0], x: [0, 10, 0] }} 
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: -40, left: -40, zIndex: 3 }}
            >
              <Box className="glass-panel" sx={{ width: 150, height: 150, borderRadius: 4, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(168,85,247,0.3)', background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(126,34,206,0.2) 100%)' }}>
                <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>AI</Typography>
              </Box>
            </motion.div>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}
