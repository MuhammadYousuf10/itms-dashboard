import { Box, Typography, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { motion } from 'framer-motion';
import { Videocam, Speed, Storage, Security } from '@mui/icons-material';

export default function Features() {
  const specs = [
    { title: '4K ANPR Cameras', icon: <Videocam sx={{ fontSize: 40 }} />, desc: 'High-resolution imaging capable of capturing plates across 4 lanes simultaneously, even in low-light or adverse weather conditions.' },
    { title: 'Doppler Radar Tracking', icon: <Speed sx={{ fontSize: 40 }} />, desc: 'Integrated multi-object radar tracks vehicle speeds up to 250km/h with a margin of error of less than 1%.' },
    { title: 'Edge Computing Node', icon: <Storage sx={{ fontSize: 40 }} />, desc: 'Inferences are run directly on the camera pole using Edge TPU, drastically reducing latency and server bandwidth.' },
    { title: 'Encrypted Transmissions', icon: <Security sx={{ fontSize: 40 }} />, desc: 'All evidence and telemetry data are end-to-end encrypted before transmission to the central database.' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: 'white' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, pt: 15, pb: 10 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 4, color: 'white' }}>
              System Technology
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 8, maxWidth: 800, lineHeight: 1.6 }}>
              ITMS is built on a foundation of state-of-the-art hardware and highly optimized machine learning models, creating a seamless, automated enforcement pipeline.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {specs.map((spec, index) => (
              <Box key={index}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Box sx={{ display: 'flex', gap: 3, p: 4, bgcolor: 'rgba(30, 41, 59, 0.5)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                    <Box sx={{ color: 'primary.main' }}>
                      {spec.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>{spec.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{spec.desc}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
