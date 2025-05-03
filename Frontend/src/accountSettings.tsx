import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { auth } from "./config/firebaseConfig";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";

export function AccountSettings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setFirstName(user.displayName?.split(' ')[0] || "");
      setLastName(user.displayName?.split(' ')[1] || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user logged in.");
      }

      if (firstName || lastName) {
        const displayName = `${firstName} ${lastName}`;
        await updateProfile(user, { displayName: displayName.trim() });
      }

      if (email !== user.email) {
        await updateEmail(user, email);
        setSuccessMessage("Email updated successfully. Please verify your new email address.");
      }

      if (password) {
        await updatePassword(user, password);
        setSuccessMessage("Password updated successfully.");
      }

      setSuccessMessage("Your account settings have been updated successfully.");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
      setPassword(""); 
    }
  };

  return (
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
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
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
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}