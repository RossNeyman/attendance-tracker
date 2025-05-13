import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useAccountSettingsLogic } from "../hooks/useAccountSettingsLogic";


export function AccountSettingsPage() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    successMessage,
    errorMessage,
    loading,
    handleSaveChanges,
  } = useAccountSettingsLogic();

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 3, fontFamily: '"Special Gothic", san-serif' }}
        >
          Account Settings
        </Typography>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Account Settings Form */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            border: "2px solid black",
            backgroundColor: "#fafafa",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: '"Special Gothic", san-serif',
            }}
          >
            Update Your Information
          </Typography>
          <Box
            component="form"
            onSubmit={handleSaveChanges}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
              fontFamily: '"Special Gothic Expanded One", san-serif',
            }}
          >
            <TextField
              label="First Name"
              variant="outlined"
              size="small"
              required
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ fontFamily: '"Special Gothic Expanded One", san-serif' }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              size="small"
              required
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ fontFamily: '"Special Gothic Expanded One", san-serif' }}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              size="small"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ fontFamily: '"Special Gothic Expanded One", san-serif' }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              size="small"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ fontFamily: '"Special Gothic Expanded One", san-serif' }}
              helperText="Leave blank to keep your current password."
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                fontFamily: '"Special Gothic Expanded One", san-serif',
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}