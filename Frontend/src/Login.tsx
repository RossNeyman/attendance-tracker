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

// Optional: Add Google Font link for Bebas Neue in public/index.html
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">

// Define the component using a function declaration or Function Component (FC) type
export function Login () {  // --- State Hooks with Types ---
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Type for anchor element
  const open = Boolean(anchorEl);

  const [showPassword, setShowPassword] = useState<boolean>(false); // Type boolean

  const [username, setUsername] = useState<string>(''); // Type string
  const [password, setPassword] = useState<string>(''); // Type string
  const [scannerCode, setScannerCode] = useState<string>(''); // Type string
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false); // Type boolean

  // --- Event Handlers with Types ---

  // Type the event as a React MouseEvent targeting an HTML Button
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => { // Explicit void return type
    setAnchorEl(null);
  };

  // Add type for the message parameter
  const handleMenuItemClick = (message: string): void => {
    alert(message);
    handleMenuClose();
  };

  const handleTogglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  // Type the event for mouse down on the icon button
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };

  const handleNewCodeClick = (): void => {
    alert('New scanner code has been sent to your device');
  };

  // Type the event for the link click
  const handleForgotLinkClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    alert('Navigating to password recovery page');
  };

  // Type the event for the input change, targeting an HTML Input element
  const handleScannerCodeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setScannerCode(value);
  };

  // Type the event for the checkbox change
  const handleStayLoggedInChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setStayLoggedIn(event.target.checked);
  }

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
        {/* Hamburger Menu */}
        <Box sx={{ position: 'absolute', top: 15, left: 15, zIndex: 1100 }}>
          <IconButton
            id="hamburgerMenu"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleMenuClick} // Event type checked here
            sx={{ fontSize: '24px', padding: '5px' }}
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

        {/* Main Content Area */}
        <Container
          maxWidth="sm"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            backgroundColor: 'rgb(222, 222, 222)',
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw !important',
            padding: 0,
          }}
        >
           <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                width: '100%',
            }}>

            {/* Logo */}
            <Typography
              variant="h1"
              component="div"
              sx={{
                fontFamily: '"Agbalumo", cursive', // Using the new example font
                // fontFamily: '"Bebas Neue", Arial, sans-serif', // Or keep Bebas Neue
                fontSize: '100px',
                fontWeight: 'normal',
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
                mb: 5,
              }}
            >
              <span style={{ color: '#cb2323' }}>Class</span>
              <span style={{ color: '#2374cb' }}>Tap</span>
            </Typography>

            {/* Login Form Section */}
            <Box sx={{ width: '100%', maxWidth: '400px', mb: 3 }}>
              {/* User ID */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" component="label" htmlFor="username" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                  User ID:
                </Typography>
                <TextField
                  id="username"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Type inference works well here
                />
              </Box>

              {/* Password */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" component="label" htmlFor="password" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                  Password:
                </Typography>
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Type inference works well here
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          onMouseDown={handleMouseDownPassword} // Event type checked here
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

              {/* Forgot Link */}
              <Box sx={{ textAlign: 'right', fontSize: '14px', mb: 2 }}>
                <Link href="#" onClick={handleForgotLinkClick} underline="hover"> {/* Event type checked here */}
                  Forgot User/Password?
                </Link>
              </Box>

              {/* Stay Logged In Checkbox */}
              <FormControlLabel
                control={<Checkbox
                    id="stayLoggedIn"
                    checked={stayLoggedIn}
                    onChange={handleStayLoggedInChange} // Event type checked here
                    size="small"
                 />}
                label="Stay Logged-In Session?"
                sx={{ display: 'block', mb: 2 }}
              />
            </Box>

            {/* Scanner Section */}
            <Paper
              elevation={2}
              sx={{
                width: '100%',
                maxWidth: '400px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#a1a1a1',
              }}
            >
              <Typography variant="h6" component="h2" sx={{ fontSize: '18px', mt: 0, mb: 2 }}>
                Use device as scanner:
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" component="label" htmlFor="scannerCode" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                   Insert code:
                </Typography>
                <TextField
                  id="scannerCode"
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="______"
                  value={scannerCode}
                  onChange={handleScannerCodeChange} // Event type checked here
                  inputProps={{
                    maxLength: 6,
                    inputMode: 'numeric',
                    pattern: '\\d{6}',
                    style: {
                      fontFamily: 'monospace',
                      fontSize: '24px',
                      letterSpacing: '10px',
                      textAlign: 'center',
                      padding: '10px',
                      backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px)',
                      backgroundSize: 'calc((100% - 10px) / 6) 1px',
                      backgroundRepeat: 'repeat-x',
                      backgroundPosition: 'bottom 10px left 5px',
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                        padding: 0,
                     }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Forgot code? →
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleNewCodeClick} // Event type checked here
                  sx={{
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                      boxShadow: 'none',
                    },
                    padding: '3px 8px'
                  }}
                >
                  New code
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
}

// Make sure the default export matches the new component name
