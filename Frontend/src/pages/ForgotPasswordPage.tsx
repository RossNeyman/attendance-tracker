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
import { useForgotPasswordLogic } from '../hooks/useForgotPasswordLogic';

/**
 * `ForgotPasswordPage` component renders the user interface for the forgot password functionality.
 * It allows users to enter their email address to receive a password reset link.
 *
 * This component utilizes the `useForgotPasswordLogic` hook to manage its state,
 * including the email input, success/error messages, and form submission logic.
 *
 * The UI includes:
 * - A logo ("ClassTAP").
 * - A form with an email input field.
 * - A "Send Reset Link" button to submit the request.
 * - A "Back to Login" button to navigate back to the login page.
 * - Display areas for success or error messages returned from the password reset process.
 *
 * It uses Material-UI components for styling and layout, ensuring a responsive design.
 *
 * @returns {JSX.Element} The rendered forgot password page.
 */
export function ForgotPasswordPage() {
  const {
    email,
    setEmail,
    message,
    error,
    handleSubmit,
    handleBackToLogin,
  } = useForgotPasswordLogic();

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

            {/* Forgot Password Form */}
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
                  Forgot Password
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
                  Enter your email address below to reset your password.
                </Typography>

                {/* Email Input */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body1"
                    component="label"
                    htmlFor="email"
                    sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}
                  >
                    Email Address:
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none', mb: 2 }}
                >
                  Send Reset Link
                </Button>

                {/* Back to Login Button */}
                <Button
                  onClick={handleBackToLogin}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
                >
                  Back to Login
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

export default ForgotPasswordPage;