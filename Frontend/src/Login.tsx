import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Link,
  Paper,
  CssBaseline,
  GlobalStyles,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

// Optional: Add Google Font link for Bebas Neue/Agbalumo in public/index.html
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Agbalumo&family=Bebas+Neue&display=swap" rel="stylesheet">

export function Login() {
  // --- Hooks ---
  const navigate = useNavigate(); // <--- Get the navigate function
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [scannerCode, setScannerCode] = useState<string>('');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);

  // --- Event Handlers ---
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (message: string): void => {
    alert(message);
    handleMenuClose();
  };

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  const handleNewCodeClick = (): void => {
    alert('New scanner code has been sent to your device');
  };

  const handleForgotLinkClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    alert('Navigating to password recovery page');
    // navigate('/forgot-password'); // Example navigation
  };

  const handleCreateAccountClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    alert('Navigating to account creation page');
    // navigate('/register'); // Example navigation
  };

  const handleScannerCodeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setScannerCode(value);
  };

  const handleStayLoggedInChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setStayLoggedIn(event.target.checked);
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log('Attempting login with:', { username, password, stayLoggedIn });
    alert(`Logging in with User ID: ${username}`);
    // --- !!! --- On successful login, navigate to home --- !!! ---
    // navigate('/home'); // <<< UNCOMMENT THIS LINE FOR REAL LOGIN
  };

  // --- NEW --- Handler for the test navigation button
  const handleGoToHomeTest = () => {
    navigate('/home'); // Navigate to the '/home' route
  };

  return (
    <>
      <CssBaseline />
      <GlobalStyles styles={{ body: { fontFamily: 'Arial, sans-serif' } }} />

      <Box sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
      }}
      >
        {/* Hamburger Menu (Consider if needed on Login page) */}
        <Box sx={{ position: 'absolute', top: 15, left: 15, zIndex: 1100 }}>
           {/* ... Hamburger Menu code ... */}
           <IconButton
            id="hamburgerMenu"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick}
            sx={{ fontSize: '50px', padding: '5px' }}
          >
            <MenuIcon fontSize="inherit" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'hamburgerMenu',
            }}
            sx={{ mt: '5px' }}
          >
            <MenuItem onClick={() => handleMenuItemClick('Navigating to Register page')}>Register</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Navigating to Student Login page')}>Student Login</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Navigating to Scanner page')}>Scanner</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Logging out...')}>Log Out</MenuItem>
          </Menu>
        </Box>

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
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>

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

            {/* Login Form Box */}
            <Box
              component="form"
              onSubmit={handleLoginSubmit}
              sx={{ width: '100%', maxWidth: '400px' }}
            >
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px' }}>
                {/* User ID */}
                <Box sx={{ mb: 2 }}>
                   {/* ... User ID field ... */}
                   <Typography variant="body1" component="label" htmlFor="username" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                    User ID:
                  </Typography>
                  <TextField
                    id="username"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </Box>

                {/* Password */}
                <Box sx={{ mb: 2 }}>
                    {/* ... Password field ... */}
                    <Typography variant="body1" component="label" htmlFor="password" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                      Password:
                    </Typography>
                    <TextField
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      size="small"
                      fullWidth
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                </Box>

                {/* Links Box */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', mb: 2 }}>
                   {/* ... Links ... */}
                   <Link href="#" onClick={handleCreateAccountClick} underline="hover">
                    Create Account
                  </Link>
                  <Link href="#" onClick={handleForgotLinkClick} underline="hover">
                    Forgot User/Password?
                  </Link>
                </Box>

                {/* Stay Logged In Checkbox */}
                <FormControlLabel
                  control={<Checkbox id="stayLoggedIn" checked={stayLoggedIn} onChange={handleStayLoggedInChange} size="small" />}
                  label="Stay Logged-In Session?"
                  sx={{ display: 'block', mb: 3 }}
                />

                {/* Login Button */}
                <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none' }}>
                  Login
                </Button>

                {/* --- START: TEST NAVIGATION BUTTON --- */}
                <Button
                  variant="outlined" // Different style to distinguish it
                  color="secondary"  // Different color
                  fullWidth
                  size="small"
                  onClick={handleGoToHomeTest} // Use the new handler
                  sx={{ mt: 2 }} // Add margin top for spacing
                >
                  (Test) Go to Home Page
                </Button>
                {/* --- END: TEST NAVIGATION BUTTON --- */}

              </Paper>
            </Box>

            {/* Scanner Section (Commented Out) */}
            {/* ... */}

          </Box>
        </Container>
      </Box>
    </>
  );
}

// export default Login; // Uncomment if needed