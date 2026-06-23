import { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, VerifiedUser as ShieldIcon } from '@mui/icons-material';
import { axiosClient } from '../../api/axiosClient';
import toast from 'react-hot-toast';

export default function Verify() {
  const navigate = useNavigate();
  const [plate, setPlate] = useState('ABC-1234'); // Pre-filled for demo
  const [chassis, setChassis] = useState('12345'); // Pre-filled for demo
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axiosClient.post('/citizen/verify', {
        plate_number: plate,
        chassis_last_5: chassis
      });
      
      if (response.data.success) {
        toast.success(`Welcome, ${response.data.owner_name}`);
        // In a real app, save the token to sessionStorage
        sessionStorage.setItem('citizen_token', response.data.token);
        sessionStorage.setItem('citizen_plate', plate);
        navigate(`/citizen/challans`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Verification failed. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 500, width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: 'primary.50', mb: 3 }}>
          <ShieldIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
          Check Traffic Fines
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter your vehicle details securely to view and pay your traffic challans.
        </Typography>

        <Alert severity="info" sx={{ mb: 4, textAlign: 'left', borderRadius: 2 }}>
          For your privacy, you must verify ownership by providing the last 5 digits of your vehicle's chassis number.
        </Alert>

        <form onSubmit={handleVerify}>
          <TextField
            fullWidth
            label="Vehicle Plate Number"
            variant="outlined"
            placeholder="e.g. ABC-1234"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600 } }}
          />
          <TextField
            fullWidth
            label="Chassis Number (Last 5 Digits)"
            variant="outlined"
            placeholder="e.g. 12345"
            value={chassis}
            onChange={(e) => {
              if (e.target.value.length <= 5) setChassis(e.target.value);
            }}
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2, fontWeight: 600, letterSpacing: '4px' } }}
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading || plate.length < 3 || chassis.length !== 5}
            startIcon={<SearchIcon />}
            sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', fontWeight: 600, boxShadow: 'none' }}
          >
            {isLoading ? 'Verifying...' : 'Search Challans'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
