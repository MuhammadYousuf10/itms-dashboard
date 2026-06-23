import { Box, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Violation Detection',
    desc: 'Smart cameras automatically detect infractions like speeding or running red lights using AI vision.'
  },
  {
    number: '02',
    title: 'Plate Recognition',
    desc: 'ANPR instantly reads the license plate and queries the central database for vehicle ownership.'
  },
  {
    number: '03',
    title: 'Challan Generation',
    desc: 'An automated ticket (challan) is instantly generated and securely stored in the cloud.'
  },
  {
    number: '04',
    title: 'Resolution',
    desc: 'Citizens log into the portal to review evidence and either pay the fine or submit a dispute.'
  }
];

export default function HowItWorksSection() {
  return (
    <Box id="how-it-works" sx={{ py: 15, bgcolor: '#0b1120', position: 'relative' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 3 }}>
            How ITMS Works
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            From capture to resolution, the entire process is fully automated and transparent.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Connecting Line */}
          <Box sx={{ position: 'absolute', top: 40, left: { xs: 40, md: '10%' }, right: { xs: 'auto', md: '10%' }, width: { xs: '2px', md: 'auto' }, height: { xs: '100%', md: '2px' }, bgcolor: 'rgba(255,255,255,0.1)' }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'space-between' }}>
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                style={{ flex: 1, position: 'relative' }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, textAlign: { xs: 'left', md: 'center' } }}>
                  <Box sx={{ 
                    width: 80, height: 80, borderRadius: '50%', bgcolor: '#0f172a', border: '2px solid', borderColor: 'primary.main',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'primary.main', fontWeight: 800, fontSize: '1.5rem',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)', zIndex: 1
                  }}>
                    {step.number}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>{step.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{step.desc}</Typography>
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
