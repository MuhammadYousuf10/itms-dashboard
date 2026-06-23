import { Box, Typography, Card, Button, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/common/FormInput';
import { settingsSchema, type SettingsFormValues } from '../../schemas/settings';

export default function Settings() {
  const { control, handleSubmit } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: 'Admin User',
      email: 'admin@itms.gov',
      speedLimitAlert: 60,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    console.log('Settings Saved:', data);
    // In the future: toast notification or API call
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          System Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure application preferences and alert thresholds
        </Typography>
      </Box>

      <Card sx={{ p: 4, maxWidth: 600, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>
            Profile Details
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInput 
              name="fullName" 
              control={control} 
              label="Full Name" 
            />
            <FormInput 
              name="email" 
              control={control} 
              label="Email Address" 
              type="email"
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>
            Alert Thresholds
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormInput 
              name="speedLimitAlert" 
              control={control} 
              label="Global Speed Limit Threshold (km/h)" 
              type="number"
            />
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size="large"
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
