import { Box, CircularProgress } from '@mui/material';

export default function SimpleLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
      <CircularProgress size={40} thickness={4} />
    </Box>
  );
}
