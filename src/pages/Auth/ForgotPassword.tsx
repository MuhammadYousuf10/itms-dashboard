import { useState } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from '../../layouts/AuthLayout';
import FormInput from '../../components/common/FormInput';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../../schemas/auth';
import { axiosClient } from '../../api/axiosClient';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    try {
      await axiosClient.post(`/auth/forgot-password?email=${encodeURIComponent(data.email)}`);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Forgot password error", err);
      // We still show submitted to prevent email enumeration
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle={isSubmitted ? "Check your email for recovery instructions." : "Enter your email and we'll send you a recovery link."}
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormInput 
              name="email" 
              control={control} 
              label="Email Address" 
              type="email" 
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              disabled={isLoading}
              sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}
            >
              {isLoading ? 'Sending...' : 'Send Recovery Link'}
            </Button>
          </Box>
        </form>
      ) : (
        <Button 
          variant="outlined" 
          size="large" 
          fullWidth
          onClick={() => navigate('/login')}
          sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}
        >
          Return to Login
        </Button>
      )}

      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
        Remember your password?{' '}
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
    </AuthLayout>
  );
}
