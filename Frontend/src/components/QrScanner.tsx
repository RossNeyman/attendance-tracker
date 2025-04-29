import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';

export function QrScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrRegionId = 'qr-reader';

    const isValidEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const startScanner = async () => {
        try {
            const scanner = new Html5Qrcode(qrRegionId);
            scannerRef.current = scanner;

            const cameras = await Html5Qrcode.getCameras();
            if (!cameras.length) {
                setError('No cameras found.');
                return;
            }

            setIsScanning(true);

            await scanner.start(
                cameras[0].id,
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    console.log("Scanned:", decodedText);

                    if (!decodedText || !isValidEmail(decodedText)) {
                        setError("This QR code is invalid or has expired. Please try again or generate a new one.");
                        stopScanner();
                        return;
                    }

                    setScanResult(decodedText);
                    stopScanner();
                },
                (errorMessage) => {
                    console.warn("Scan error:", errorMessage);
                }
            );
        } catch (err) {
            console.error('Failed to start scanner:', err);
            setError('Could not start scanner.');
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
                setIsScanning(false);
            } catch (err) {
                console.error('Failed to stop scanner:', err);
            }
        }
    };

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>{error}</Alert>
            )}

            <Typography variant="h5" fontWeight="bold" textAlign="center">
                {scanResult ? `Scanned Result: ${scanResult}` : 'No result yet'}
            </Typography>

            <Paper elevation={3} sx={{ p: 2, border: '2px solid black', backgroundColor: '#fafafa', maxWidth: 520, width: '100%' }}>
                <div
                    id={qrRegionId}
                    style={{ width: 500, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                ></div>
            </Paper>

            <Button
                variant="contained"
                color={isScanning ? 'error' : 'primary'}
                onClick={isScanning ? stopScanner : startScanner}
                sx={{ width: 200 }}
            >
                {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
        </Box>
    );
}