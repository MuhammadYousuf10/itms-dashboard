import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
  { number: '01', title: 'Detection', desc: '4K cameras capture infractions in real-time, regardless of vehicle speed.' },
  { number: '02', title: 'Processing', desc: 'Edge TPUs instantly run ANPR models to extract license plates.' },
  { number: '03', title: 'Validation', desc: 'The cloud backend securely logs the violation and generates proof.' },
  { number: '04', title: 'Resolution', desc: 'Citizens securely view evidence and pay fines via the portal.' }
];

export default function HowItWorksSection() {
  return (
    <Box id="how-it-works" sx={{ py: 24, position: 'relative' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 16, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: 'spring' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              The <span style={{ color: '#a855f7' }}>Pipeline</span>
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '1.25rem', lineHeight: 1.6 }}>
              From capture to resolution, fully automated, encrypted, and transparent.
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ position: 'relative', ml: { xs: 2, md: 4 } }}>
          {/* Animated Connecting Line */}
          <motion.div 
            initial={{ height: 0 }} whileInView={{ height: '100%' }} viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: 32, width: '2px', background: 'linear-gradient(180deg, #38bdf8 0%, #a855f7 100%)', zIndex: 0 }} 
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.2, type: 'spring', bounce: 0.4 }}
                style={{ position: 'relative', zIndex: 1 }}
              >
                <Box className="glass-panel" sx={{ display: 'flex', gap: 4, alignItems: 'center', p: 4, borderRadius: 6, ml: 6 }}>
                  <Box sx={{ 
                    position: 'absolute', left: -72, width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                    border: '2px solid', borderColor: index % 2 === 0 ? '#38bdf8' : '#a855f7',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 800,
                    boxShadow: `0 0 20px ${index % 2 === 0 ? 'rgba(56,189,248,0.4)' : 'rgba(168,85,247,0.4)'}`
                  }}>
                    {step.number}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>{step.title}</Typography>
                    <Typography sx={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '1.1rem' }}>{step.desc}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
