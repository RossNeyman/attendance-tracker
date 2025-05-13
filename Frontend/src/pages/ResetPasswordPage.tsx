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
import { useResetPasswordLogic } from '../hooks/useResetPasswordLogic';

/**
 * `ResetPassword` component renders the user interface for the reset password functionality.
 * It allows users to enter a new password and confirm it.
 *
 * This component utilizes the `useResetPasswordLogic` hook to manage its state,
 * including the new password, confirmation password, success/error messages,
 * and form submission logic.
 *
 * The UI includes:
 * - A logo ("ClassTAP").
 * - A form with new password and confirm password input fields.
 * - A "Reset Password" button to submit the form.
 * - Display areas for success or error messages returned from the reset password process.
 *
 * It uses Material-UI components for styling and layout, ensuring a responsive design.
 *
 * @returns {JSX.Element} The rendered reset password page.
 */
export function ResetPassword() {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    error,
    handleSubmit,
  } = useResetPasswordLogic();

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
                    helperText="Password should be at least 6 characters."
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