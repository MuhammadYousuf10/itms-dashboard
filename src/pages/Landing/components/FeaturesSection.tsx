import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Speed, LocalPolice, Timeline, CameraAlt } from '@mui/icons-material';

const features = [
  {
    icon: <CameraAlt sx={{ fontSize: 40 }} />,
    title: 'ANPR Technology',
    desc: 'Automatic Number Plate Recognition captures and identifies vehicles at high speeds with 99.8% accuracy.',
    color: '#38bdf8'
  },
  {
    icon: <Speed sx={{ fontSize: 40 }} />,
    title: 'Automated Violations',
    desc: 'Instantly detects speeding, red-light running, and illegal parking, generating verifiable challans in real-time.',
    color: '#a855f7'
  },
  {
    icon: <LocalPolice sx={{ fontSize: 40 }} />,
    title: 'Dispute Resolution',
    desc: 'Citizens can securely view photographic evidence of their violations and submit disputes directly to traffic admins.',
    color: '#10b981'
  },
  {
    icon: <Timeline sx={{ fontSize: 40 }} />,
    title: 'Live Analytics',
    desc: 'Powerful dashboard for traffic operators to monitor city-wide congestion, camera health, and revenue generation.',
    color: '#f59e0b'
  }
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: 15, bgcolor: '#0f172a' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 800, letterSpacing: '2px', mb: 2, display: 'block' }}>
            CORE CAPABILITIES
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 3 }}>
            Powered by Artificial Intelligence
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  bgcolor: 'rgba(30, 41, 59, 0.5)', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  borderRadius: 4,
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', borderColor: feature.color }
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: 3, bgcolor: `${feature.color}20`, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
