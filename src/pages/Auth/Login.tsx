import { useState } from 'react';
import { Box, Button, Typography, Link, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AuthLayout from '../../layouts/AuthLayout';
import FormInput from '../../components/common/FormInput';
import { useAuthStore } from '../../store/useAuthStore';
import { loginSchema, type LoginFormValues } from '../../schemas/auth';

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
    
    // TODO: Replace with actual React Query mutation calling the FastAPI backend
    setTimeout(() => {
      // Mock successful login
      login('mock-jwt-token-12345', {
        id: '1',
        name: 'Admin User',
        email: data.email,
        role: 'admin'
      });
      navigate('/');
    }, 1000);
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
