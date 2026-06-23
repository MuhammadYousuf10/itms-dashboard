import { useState } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../../layouts/AuthLayout';
import FormInput from '../../components/common/FormInput';
import { signUpSchema, type SignUpFormValues } from '../../schemas/auth';
import toast from 'react-hot-toast';
import { axiosClient } from '../../api/axiosClient';

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    
    try {
      await axiosClient.post('/auth/register', {
        email: data.email,
        full_name: data.name,
        password: data.password,
      });
      toast.success('Account created successfully');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join ITMS Pro to monitor and manage traffic seamlessly."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          
          <FormInput 
            name="name" 
            control={control} 
            label="Full Name" 
          />
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
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2, py: 1.5, fontSize: '1rem' }}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link 
              component="button" 
              type="button"
              variant="body2" 
              onClick={() => navigate('/login')}
              sx={{ fontWeight: 600, textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </form>
    </AuthLayout>
  );
}
