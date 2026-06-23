import { Box, Typography, Card, Button, Divider, Avatar, IconButton, Chip } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/common/FormInput';
import { settingsSchema, type SettingsFormValues } from '../../schemas/settings';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

export default function Settings() {
  const user = useAuthStore((state) => state.user);

  const { control, handleSubmit } = useForm<z.input<typeof settingsSchema>, any, SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: user?.name || 'Admin User',
      email: user?.email || 'admin@itms.gov',
      speedLimitAlert: 60,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    toast.success('Profile & Settings saved successfully!');
    console.log('Settings Saved:', data);
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Profile & Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account details, preferences, and system alerts
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Profile Card */}
        <Card sx={{ p: 4, width: { xs: '100%', md: 350 }, border: 1, borderColor: 'divider', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar src="https://i.pravatar.cc/150?img=11" sx={{ width: 120, height: 120 }} />
            <IconButton 
              color="primary" 
              aria-label="upload picture" 
              component="label"
              sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.default' } }}
            >
              <input hidden accept="image/*" type="file" />
              <PhotoCamera />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user?.email || 'admin@itms.gov'}
          </Typography>
          <Chip label={(user?.role || 'Administrator').toUpperCase()} color="primary" size="small" sx={{ fontWeight: 600 }} />
        </Card>

        {/* Settings Form */}
        <Card sx={{ p: 4, flex: 1, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 3 }}>
              Edit Profile Details
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
    </Box>
  );
}
