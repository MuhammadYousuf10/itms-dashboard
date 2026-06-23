import { Box, Typography, Container, Button } from '@mui/material';
import { Security as SecurityIcon, AccountCircle as CitizenIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PortalCards() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 24, position: 'relative', overflow: 'hidden' }}>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, type: 'spring' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Access <span style={{ color: '#10b981' }}>Workspace</span>
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '1.25rem', maxWidth: 500, mx: 'auto' }}>
              Select your designated portal below. All sessions are secured with military-grade encryption.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
          {/* Citizen Portal */}
          <motion.div initial={{ opacity: 0, y: 50, rotateY: -15 }} whileInView={{ opacity: 1, y: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }} style={{ perspective: 1000 }}>
            <Box 
              className="glass-panel"
              sx={{ p: 6, borderRadius: 6, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', height: '100%',
                '&:hover': { transform: 'scale(1.05) translateY(-10px)', borderColor: 'rgba(56,189,248,0.5)', boxShadow: '0 30px 60px rgba(56,189,248,0.2)' }
              }}
              onClick={() => navigate('/citizen')}
            >
              <Box sx={{ width: 80, height: 80, borderRadius: 4, background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, boxShadow: '0 10px 20px rgba(56,189,248,0.4)' }}>
                <CitizenIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>Public Portal</Typography>
              <Typography sx={{ color: '#94a3b8', mb: 6, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Verify vehicle fines, download high-resolution evidence, and pay or dispute challans securely online.
              </Typography>
              <Button variant="contained" fullWidth sx={{ py: 2, fontSize: '1.1rem' }}>Enter Portal</Button>
            </Box>
          </motion.div>

          {/* Staff Portal */}
          <motion.div initial={{ opacity: 0, y: 50, rotateY: 15 }} whileInView={{ opacity: 1, y: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring', delay: 0.1 }} style={{ perspective: 1000 }}>
            <Box 
              className="glass-panel"
              sx={{ p: 6, borderRadius: 6, cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', height: '100%',
                '&:hover': { transform: 'scale(1.05) translateY(-10px)', borderColor: 'rgba(168,85,247,0.5)', boxShadow: '0 30px 60px rgba(168,85,247,0.2)' }
              }}
              onClick={() => navigate('/dashboard')}
            >
              <Box sx={{ width: 80, height: 80, borderRadius: 4, background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, boxShadow: '0 10px 20px rgba(168,85,247,0.4)' }}>
                <SecurityIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>Staff Node</Typography>
              <Typography sx={{ color: '#94a3b8', mb: 6, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Restricted access. Command the camera grid, analyze live metrics, and review citizen disputes.
              </Typography>
              <Button variant="contained" color="secondary" fullWidth sx={{ py: 2, fontSize: '1.1rem', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}>Authenticate</Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
