import { useState } from 'react';
import { Box, Typography, Card, Button, Divider, Avatar, IconButton, Chip, Tabs, Tab, Switch, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { PhotoCamera, Person, Security, Notifications, Settings as SettingsIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/common/FormInput';
import { settingsSchema, type SettingsFormValues } from '../../schemas/settings';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '../../api/axiosClient';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ py: 0, px: { xs: 0, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [tabValue, setTabValue] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await axiosClient.get('/users/me');
      return res.data;
    }
  });

  const { control, handleSubmit } = useForm<z.input<typeof settingsSchema>, unknown, SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: userData ? {
      fullName: userData.full_name || '',
      email: userData.email || '',
      phone: userData.settings?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorAuth: userData.settings?.twoFactorAuth || false,
      emailAlerts: userData.settings?.emailAlerts ?? true,
      smsAlerts: userData.settings?.smsAlerts || false,
      weeklyReport: userData.settings?.weeklyReport ?? true,
      speedLimitAlert: userData.settings?.speedLimitAlert || 60,
      refreshInterval: userData.settings?.refreshInterval || '30',
      defaultLocation: userData.settings?.defaultLocation || 'New York',
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: SettingsFormValues) => {
      const res = await axiosClient.put('/users/me/settings', {
        full_name: data.fullName,
        email: data.email,
        current_password: data.currentPassword || undefined,
        new_password: data.newPassword || undefined,
        settings: {
          phone: data.phone,
          twoFactorAuth: data.twoFactorAuth,
          emailAlerts: data.emailAlerts,
          smsAlerts: data.smsAlerts,
          weeklyReport: data.weeklyReport,
          speedLimitAlert: data.speedLimitAlert,
          refreshInterval: data.refreshInterval,
          defaultLocation: data.defaultLocation
        }
      });
      
      let updatedUser = res.data;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const avatarRes = await axiosClient.post('/users/me/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        updatedUser = avatarRes.data;
      }
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      toast.success('Settings saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      if (user) {
        updateUser({
          ...user,
          name: updatedUser.full_name,
          email: updatedUser.email
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to save settings');
    }
  });

  const onSubmit = (data: SettingsFormValues) => {
    mutation.mutate(data);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your account details, preferences, and system alerts
        </Typography>
      </Box>

      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, border: 1, borderColor: 'divider', boxShadow: 'none', borderRadius: 3, minHeight: 600 }}>
        {/* Vertical Tabs */}
        <Box sx={{ borderRight: { xs: 0, md: 1 }, borderBottom: { xs: 1, md: 0 }, borderColor: 'divider', width: { xs: '100%', md: 250 }, bgcolor: 'background.default' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ 
              '& .MuiTabs-indicator': { left: 0, right: 'auto', width: 3, borderRadius: '0 4px 4px 0' },
              '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', px: 3, py: 2.5, minHeight: 60, textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }
            }}
          >
            <Tab icon={<Person sx={{ mr: 2 }} />} iconPosition="start" label="Profile" />
            <Tab icon={<Security sx={{ mr: 2 }} />} iconPosition="start" label="Security" />
            <Tab icon={<Notifications sx={{ mr: 2 }} />} iconPosition="start" label="Notifications" />
            <Tab icon={<SettingsIcon sx={{ mr: 2 }} />} iconPosition="start" label="Preferences" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Tab 1: Profile */}
            <CustomTabPanel value={tabValue} index={0}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Profile Details</Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, alignItems: { xs: 'center', sm: 'flex-start' }, mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar src={avatarPreview || userData?.settings?.avatarUrl || "https://i.pravatar.cc/150?img=11"} sx={{ width: 120, height: 120 }} />
                  <IconButton 
                    color="primary" 
                    component="label"
                    sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.default' } }}
                  >
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    <PhotoCamera />
                  </IconButton>
                </Box>
                <Box sx={{ flexGrow: 1, width: '100%' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormInput name="fullName" control={control} label="Full Name" />
                    <FormInput name="email" control={control} label="Email Address" type="email" />
                    <FormInput name="phone" control={control} label="Phone Number" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Role / Department</Typography>
                      <Chip label={(user?.role || 'Administrator').toUpperCase()} color="primary" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CustomTabPanel>

            {/* Tab 2: Security */}
            <CustomTabPanel value={tabValue} index={1}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Security Settings</Typography>
              <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormInput name="currentPassword" control={control} label="Current Password" type="password" />
                <FormInput name="newPassword" control={control} label="New Password" type="password" />
                <FormInput name="confirmPassword" control={control} label="Confirm New Password" type="password" />
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Two-Factor Authentication</Typography>
                    <Typography variant="body2" color="text.secondary">Secure your account with 2FA.</Typography>
                  </Box>
                  <Controller
                    name="twoFactorAuth"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} color="primary" />}
                  />
                </Box>
              </Box>
            </CustomTabPanel>

            {/* Tab 3: Notifications */}
            <CustomTabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Notification Preferences</Typography>
              <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Email Alerts</Typography>
                    <Typography variant="body2" color="text.secondary">Receive high-priority violations via email.</Typography>
                  </Box>
                  <Controller
                    name="emailAlerts"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} color="primary" />}
                  />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>SMS Alerts</Typography>
                    <Typography variant="body2" color="text.secondary">Get text messages for critical system outages.</Typography>
                  </Box>
                  <Controller
                    name="smsAlerts"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} color="primary" />}
                  />
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Weekly Analytics Report</Typography>
                    <Typography variant="body2" color="text.secondary">A summary of the system performance every Monday.</Typography>
                  </Box>
                  <Controller
                    name="weeklyReport"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} color="primary" />}
                  />
                </Box>
              </Box>
            </CustomTabPanel>

            {/* Tab 4: Preferences */}
            <CustomTabPanel value={tabValue} index={3}>
              <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>System Preferences</Typography>
              <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <FormInput name="speedLimitAlert" control={control} label="Global Speed Limit Threshold (km/h)" type="number" />
                
                <Controller
                  name="refreshInterval"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="refresh-label">Dashboard Refresh Interval</InputLabel>
                      <Select {...field} labelId="refresh-label" label="Dashboard Refresh Interval">
                        <MenuItem value="30">Every 30 seconds</MenuItem>
                        <MenuItem value="60">Every 1 minute</MenuItem>
                        <MenuItem value="300">Every 5 minutes</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="defaultLocation"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="location-label">Default Map Center</InputLabel>
                      <Select {...field} labelId="location-label" label="Default Map Center">
                        <MenuItem value="New York">New York</MenuItem>
                        <MenuItem value="London">London</MenuItem>
                        <MenuItem value="Tokyo">Tokyo</MenuItem>
                        <MenuItem value="Dubai">Dubai</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
            </CustomTabPanel>

            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ px: 4 }}>
                Save Changes
              </Button>
            </Box>

          </form>
        </Box>
      </Card>
    </Box>
  );
}
