import { Box, Typography, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Speed, LocalPolice, Timeline, CameraAlt } from '@mui/icons-material';

const features = [
  { icon: <CameraAlt sx={{ fontSize: 32 }} />, title: 'ANPR Matrix', desc: 'Military-grade precision operating flawlessly in zero-light environments at 200km/h.' },
  { icon: <Speed sx={{ fontSize: 32 }} />, title: 'Edge Processing', desc: 'Edge TPUs process infractions instantly in under 200 milliseconds.' },
  { icon: <LocalPolice sx={{ fontSize: 32 }} />, title: 'Smart Disputes', desc: 'Secure high-res photographic evidence and digital disputes via the portal.' },
  { icon: <Timeline sx={{ fontSize: 32 }} />, title: 'City Analytics', desc: 'Visualize congestion maps and revenue streams through a real-time command dashboard.' }
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: 24, position: 'relative' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 16 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.8, type: 'spring' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Unmatched <span style={{ color: '#38bdf8' }}>Capabilities</span>
            </Typography>
            <Typography sx={{ color: '#94a3b8', maxWidth: 600, mx: 'auto', fontSize: '1.25rem', lineHeight: 1.6 }}>
              We rebuilt traffic management from the ground up, combining edge computing with a seamless user experience.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', bounce: 0.4 }}
                style={{ height: '100%' }}
              >
                <Box className="glass-panel" sx={{ 
                  p: 6, borderRadius: 6, height: '100%', position: 'relative', overflow: 'hidden',
                  transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-10px)', borderColor: 'rgba(56,189,248,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }
                }}>
                  <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                  
                  <Box sx={{ width: 64, height: 64, borderRadius: 4, background: 'linear-gradient(135deg, rgba(56,189,248,0.2) 0%, rgba(37,99,235,0.2) 100%)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, border: '1px solid rgba(56,189,248,0.3)' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>{feature.title}</Typography>
                  <Typography sx={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1.1rem' }}>{feature.desc}</Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
