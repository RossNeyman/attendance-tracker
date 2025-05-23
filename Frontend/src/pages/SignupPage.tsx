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
import { useSignupLogic } from '../hooks/useSignupLogic';

/**
 * `SignupPage` component renders the user interface for the signup functionality.
 * It allows users to create a new account by entering their details.
 *
 * This component utilizes the `useSignupLogic` hook to manage its state,
 * including the first name, last name, email, password, confirmation password,
 * and error messages.
 *
 * The UI includes:
 * - A logo ("ClassTAP").
 * - A form with fields for first name, last name, email, password, and confirmation password.
 * - A "Stay Logged-In Session?" checkbox.
 * - A link to navigate to the login page if the user already has an account.
 * - A "Signup" button to submit the form.
 * - Display area for error messages returned from the signup process.
 *
 * It uses Material-UI components for styling and layout, ensuring a responsive design.
 *
 * @returns {JSX.Element} The rendered signup page.
 */
export function SignupPage() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    stayLoggedIn,
    setStayLoggedIn,
    signupError,
    handleSignup,
    handleLoginLinkClick,
  } = useSignupLogic();

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
                {/* Display Signup Error */}
                {signupError && (
                  <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                    {signupError}
                  </Typography>
                )}

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

                {/* First Name */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="firstName"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    First Name:
                  </Typography>
                  <TextField
                    id="firstName"
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Box>

                {/* Last Name */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="lastName"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    Last Name:
                  </Typography>
                  <TextField
                    id="lastName"
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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