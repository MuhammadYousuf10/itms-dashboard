import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import PortalCards from './components/PortalCards';
import Footer from './components/Footer';

export default function Landing() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: 'white' }}>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PortalCards />
      </Box>
      <Footer />
    </Box>
  );
}
