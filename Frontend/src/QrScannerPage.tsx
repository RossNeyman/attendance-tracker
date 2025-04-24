import * as React from 'react';
import NavBar from './components/NavBar';
import { QrScanner } from './components/QrScanner';
import { Box, Button, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function QrScannerPage() {
    const navigate = useNavigate(); // Hook to navigate between routes

    return (
        <>
            <NavBar />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 4,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    QR Scanner
                </Typography>
                <Divider
                    sx={{
                        marginTop: 2,
                        marginBottom: 4,
                        backgroundColor: 'primary.main',
                        height: '2px',
                        width: '80%',
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')} // Navigate to the homepage
                    >
                        Exit to Login
                    </Button>
                    <Box
                        sx={{
                            width: '300px', // Adjust the width of the QR Scanner
                            height: '300px', // Adjust the height of the QR Scanner
                            overflow: 'hidden',
                        }}
                    >
                        <QrScanner />
                    </Box>
                </Box>
            </Box>
        </>
    );
}