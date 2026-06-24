import { useState } from 'react';
import { Box, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../../layouts/AuthLayout';
import FormInput from '../../components/common/FormInput';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema, type LoginFormValues } from '../../schemas/auth';
import { axiosClient } from '../../api/axiosClient';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  // 2. Initialize React Hook Form
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 3. Handle submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await axiosClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, user } = response.data;
      
      login(access_token, {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role.toLowerCase()
      });
      
      toast.success('Successfully logged in');
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.detail || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access the dashboard"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          
          {/* Reusable Form Fields */}
          <FormInput 
            name="email" 
            control={control} 
            label="Email Address" 
            type="email" 
          />
          
          <FormInput 
            name="password" 
            control={control} 
            label="Password" 
            type="password" 
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel 
              control={<Checkbox color="primary" />} 
              label={<Typography variant="body2" color="text.secondary">Remember me</Typography>} 
            />
            <Link 
              component="button" 
              type="button"
              variant="body2" 
              onClick={() => navigate('/forgot-password')}
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            disabled={isLoading}
            sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link 
              component="button" 
              type="button"
              variant="body2" 
              onClick={() => navigate('/signup')}
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </form>
    </AuthLayout>
  );
}
