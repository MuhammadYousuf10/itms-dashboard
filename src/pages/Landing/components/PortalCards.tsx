import { Box, Typography, Container, Card, CardContent, Button } from '@mui/material';
import { Security as SecurityIcon, AccountCircle as CitizenIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PortalCards() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 15, bgcolor: '#0f172a', position: 'relative' }}>
      {/* Background glow */}
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(15,23,42,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
            Access Your Portal
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Whether you are a citizen checking on a fine, or a traffic operator managing the city network.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center', px: { xs: 0, md: 8 } }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ flex: 1 }}>
            <Card sx={{ 
              height: '100%', bgcolor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4,
              transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', borderColor: 'primary.main', boxShadow: '0 12px 40px rgba(56, 189, 248, 0.15)' },
              display: 'flex', flexDirection: 'column'
            }}>
              <CardContent sx={{ p: 5, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(56, 189, 248, 0.1)', color: 'primary.main', mb: 3 }}>
                  <CitizenIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>Citizen Portal</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1 }}>
                  Access your personal vehicle records, pay outstanding traffic fines securely, or submit dispute evidence for administrative review.
                </Typography>
                <Button variant="contained" size="large" fullWidth onClick={() => navigate('/citizen')} sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', boxShadow: 'none' }}>
                  Enter Citizen Portal
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} style={{ flex: 1 }}>
            <Card sx={{ 
              height: '100%', bgcolor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4,
              transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-8px)', borderColor: 'secondary.main', boxShadow: '0 12px 40px rgba(168, 85, 247, 0.15)' },
              display: 'flex', flexDirection: 'column'
            }}>
              <CardContent sx={{ p: 5, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(168, 85, 247, 0.1)', color: 'secondary.main', mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'white' }}>Department Staff</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, flexGrow: 1 }}>
                  Secure access for Traffic Operators and Administrators. Manage cameras, process disputes, view analytics, and monitor live feeds.
                </Typography>
                <Button variant="contained" color="secondary" size="large" fullWidth onClick={() => navigate('/dashboard')} sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem', boxShadow: 'none' }}>
                  Staff Login
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
