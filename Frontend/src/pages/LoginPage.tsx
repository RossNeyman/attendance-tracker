import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Link,
  Paper,
  CssBaseline,
  GlobalStyles,
  Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLoginLogic } from '../hooks/useLoginLogic';

/**
 * `Login` component renders the user interface for the login functionality.
 * It allows users to enter their username and password to access the application.
 *
 * This component utilizes the `useLoginLogic` hook to manage its state,
 * including the username, password, visibility of the password, error messages,
 * and form submission logic.
 *
 * The UI includes:
 * - A logo ("ClassTAP").
 * - A form with username and password input fields.
 * - A "Stay Logged-In Session?" checkbox.
 * - Links for creating an account and recovering a password.
 * - A "Login" button to submit the form.
 * - Display area for error messages returned from the login process.
 *
 * It uses Material-UI components for styling and layout, ensuring a responsive design.
 *
 * @returns {JSX.Element} The rendered login page.
 */
export function Login() {
  const {
    showPassword,
    username,
    setUsername,
    password,
    setPassword,
    stayLoggedIn,
    loginError,
    handleTogglePasswordVisibility,
    handleMouseDownPassword,
    handleForgotLinkClick,
    handleCreateAccountClick,
    handleStayLoggedInChange,
    handleLogin,
  } = useLoginLogic();

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

            <Box sx={{ width: '100%', maxWidth: '400px' }}>
              <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: '8px' }}>
                {loginError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {loginError}
                  </Alert>
                )}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="username"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
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
                            {showPassword ? (
                              <VisibilityOff fontSize="small" />
                            ) : (
                              <Visibility fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    mb: 2,
                  }}
                >
                  <Link href="#" onClick={handleCreateAccountClick} underline="hover">
                    Create Account
                  </Link>
                  <Link href="#" onClick={handleForgotLinkClick} underline="hover">
                    Forgot User/Password?
                  </Link>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      id="stayLoggedIn"
                      checked={stayLoggedIn}
                      onChange={handleStayLoggedInChange}
                      size="small"
                    />
                  }
                  label="Stay Logged-In Session?"
                  sx={{ display: 'block', mb: 3 }}
                />

                <Button
                  onClick={handleLogin}
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                >
                  Login
                </Button>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}