import { Box, Typography, Container } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: 'white' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, pt: 15, pb: 10 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 4, color: 'white' }}>
              About the Department
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 8, maxWidth: 800, lineHeight: 1.6 }}>
              The City Traffic Department is committed to ensuring the safety, efficiency, and sustainability of our urban mobility network. By leveraging cutting-edge AI and computer vision, we are modernizing how traffic rules are enforced and how citizens interact with public infrastructure.
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 6 }}>
            <Box>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                <Box sx={{ p: 4, bgcolor: 'rgba(30, 41, 59, 0.5)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>Our Mission</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    To drastically reduce traffic fatalities and congestion through autonomous, fair, and real-time enforcement of traffic regulations, ensuring safer streets for pedestrians and drivers alike.
                  </Typography>
                </Box>
              </motion.div>
            </Box>
            <Box>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }}>
                <Box sx={{ p: 4, bgcolor: 'rgba(30, 41, 59, 0.5)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'secondary.main' }}>Transparency & Fairness</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    We believe in an open relationship with citizens. Our integrated Citizen Portal allows anyone to easily verify violations, view photographic evidence, and submit transparent disputes.
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
