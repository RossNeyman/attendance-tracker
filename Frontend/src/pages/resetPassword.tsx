import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    const oobCode = searchParams.get('oobCode'); 

    if (!oobCode) {
      setError('Invalid or missing reset code.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Your password has been successfully reset.');
      setError('');
      setTimeout(() => navigate('/'), 3000); 
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
      setMessage('');
    }
  };

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ body: { fontFamily: 'Arial, sans-serif' } }} />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Logo */}
            <Typography
              variant="h1"
              component="div"
              sx={{
                fontFamily: '"Agbalumo", cursive',
                fontSize: { xs: '100px', sm: '150px' },
                fontWeight: 'normal',
                textAlign: 'center',
                textShadow: '4px 2px 4px rgba(0, 0, 0, 0.15)',
                mb: 3,
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#cb2323' }}>Class</span>
              <span style={{ color: '#2374cb' }}>TAP</span>
            </Typography>

            {/* Reset Password Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%', maxWidth: '400px' }}
            >
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px' }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  Reset Password
                </Typography>
                <Typography
                  variant="body2"
                  component="p"
                  sx={{
                    textAlign: 'center',
                    mb: 3,
                    color: 'text.secondary',
                  }}
                >
                  Enter your new password below.
                </Typography>

                {/* New Password Input */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="newPassword"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    New Password:
                  </Typography>
                  <TextField
                    id="newPassword"
                    type="password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Box>

                {/* Confirm Password Input */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="confirmPassword"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    Confirm Password:
                  </Typography>
                  <TextField
                    id="confirmPassword"
                    type="password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none', mb: 2 }}
                >
                  Reset Password
                </Button>

                {/* Success Message */}
                {message && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      color: 'green',
                    }}
                  >
                    {message}
                  </Typography>
                )}

                {/* Error Message */}
                {error && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      color: 'red',
                    }}
                  >
                    {error}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ResetPassword;