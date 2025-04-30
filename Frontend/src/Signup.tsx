import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  FormControlLabel,
  Checkbox,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      // Replace with your signup logic
      console.log('Signing up user:', { username, email, password });
      alert('Signup successful!');
      navigate('/home'); // Navigate to the home page after signup
    } catch (error) {
      alert('Signup failed. Please try again.');
    }
  };

  const handleLoginLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/login'); // Navigate to the login page
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

            {/* Signup Form Box */}
            <Box
              component="form"
              onSubmit={handleSignup}
              sx={{ width: '100%', maxWidth: '400px' }}
            >
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px' }}>
                {/* Username */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="username"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    Username:
                  </Typography>
                  <TextField
                    id="username"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Box>

                {/* Email */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="email"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    Email:
                  </Typography>
                  <TextField
                    id="email"
                    type="email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="password"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    Password:
                  </Typography>
                  <TextField
                    id="password"
                    type="password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>

                {/* Confirm Password */}
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

                {/* Stay Logged In Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      id="stayLoggedIn"
                      checked={stayLoggedIn}
                      onChange={(e) => setStayLoggedIn(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Stay Logged-In Session?"
                  sx={{ display: 'block', mb: 3 }}
                />

                {/* Signup Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                >
                  Signup
                </Button>

                {/* Login Link */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '14px',
                    mt: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Already have an account?
                  </Typography>
                  <Link href="#" onClick={handleLoginLinkClick} underline="hover">
                    Login
                  </Link>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}