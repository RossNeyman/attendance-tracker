import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { QrScanner } from "./components/QrScanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";

export function QrScannerPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [csiEmail, setCsiEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null); 
  const [roomId, _setRoomId] = useState("defaultRoomId");
  const [weekId, setWeekId] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null); 
        navigate("/login"); 
      }
    });

    const currentWeekId = `week-${new Date().toISOString().slice(0, 10)}`;
    setWeekId(currentWeekId);
    return () => unsubscribe(); 
  }, [navigate]);

  const handleExit = () => {
    navigate("/");
  };

  const handleGenerateQrCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Generating QR Code for:", { firstName, lastName, csiEmail });
    alert(`A new QR code would be sent to ${csiEmail} (Implementation Needed)`);
  };

  return (
    <>
      {/* Use Container for consistent padding and max-width */}
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        {/* 2. Exit Button Area */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            onClick={handleExit}
            sx={{
              backgroundColor: "#d32f2f", // Material Red 700
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "8px 24px",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#b71c1c", // darker red on hover
              },
            }}
          >
            EXIT
          </Button>
        </Box>

        {/* 3. Camera Scanner Section */}
        <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, mb: 2 }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px", // Max width for the scanner area
              minHeight: "300px", // Minimum height to contain the QrScanner content comfortably
              overflow: "hidden",
              margin: "0 auto", // Center the box
              border: "2px solid black", // Border like sketch
              backgroundColor: "common.white", // Use white background to match QrScanner output
              display: "flex", // Use flex to help center QrScanner content if needed
              justifyContent: "center",
              alignItems: "center",
              p: 2, // Add some padding inside the border
            }}
          >
            {/* Pass userId, roomId, and weekId as props to QrScanner */}
            {userId && weekId && (
              <QrScanner userId={userId} roomId={roomId} weekId={weekId} />
            )}
          </Box>
          <Typography
            variant="subtitle1"
            align="center"
            fontWeight={"bold"}
            sx={{ mt: 1, fontWeight: "medium" }}
          >
            Scan QR Code
          </Typography>
        </Paper>

        {/* 4. QR Code Generation Section */}
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "center",
              fontWeight: "BOLD",
              fontFamily: '"Special Gothic", san-serif',
            }}
          >
            Don't have a QR code yet? ..... Make One!
          </Typography>
          <Box
            component="form"
            onSubmit={handleGenerateQrCode}
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
              label="CSI Email"
              variant="outlined"
              type="email"
              size="small"
              required
              fullWidth
              value={csiEmail}
              onChange={(e) => setCsiEmail(e.target.value)}
              sx={{ fontFamily: '"Special Gothic Expanded One", san-serif' }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 1, fontFamily: '"Special Gothic Expanded One", san-serif' }}
            >
              Make QR Code
            </Button>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
              color: "text.secondary",
              fontFamily: '"Special Gothic Expanded One", san-serif',
            }}
          >
            A <span style={{ fontWeight: "bold" }}>NEW</span> QR code will be
            sent to your CSI email....
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
