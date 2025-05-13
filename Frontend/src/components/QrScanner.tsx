import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography, Button, Alert, Paper } from '@mui/material';
import { useLogAttendanceMutation } from '../features/logsSlice';

/**
 * `QrScanner` is a React component that provides a user interface for scanning QR codes.
 * It utilizes the `html5-qrcode` library to access the device's camera and decode QR codes.
 * The component displays the scanned result, handles errors during scanning, and shows success messages.
 * It also includes functionality to start and stop the scanner, and to save the scanned data (expected to be an email)
 * to a backend service using the `useLogAttendanceMutation` hook.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.userId - The ID of the user initiating the scan. This is used when logging attendance.
 * @param {string} props.roomId - The ID of the room for which attendance is being logged. This is used when logging attendance.
 * @returns {JSX.Element} The QrScanner component.
 *
 * @example
 * ```tsx
 * <QrScanner userId="user123" roomId="room456" />
 * ```
 *
 * @remarks
 * The component manages several states:
 * - `scanResult`: Stores the decoded text from the QR code.
 * - `error`: Stores any error messages encountered during scanning or backend communication.
 * - `success`: Stores success messages, typically after successfully saving scan data.
 * - `isScanning`: A boolean indicating whether the scanner is currently active.
 *
 * It uses a `useRef` (`scannerRef`) to hold the instance of `Html5Qrcode`.
 * The QR code reader UI is rendered within a `div` element with the ID `qr-reader`.
 *
 * **Functionality:**
 * - **Start Scanning:** Initializes the `Html5Qrcode` instance, requests camera access, and starts the scanning process.
 *   It looks for the first available camera.
 * - **Stop Scanning:** Stops the active scanner and clears its resources. This is also called on component unmount.
 * - **QR Code Validation:** Checks if the scanned text is a valid email address using a regex.
 * - **Save to Backend:** On a successful and valid scan, it calls `logAttendance` mutation to send the `userId`, `roomId`,
 *   and the scanned `email` to the backend.
 * - **UI Elements:**
 *   - Displays error messages using an `Alert` component.
 *   - Displays success messages using an `Alert` component.
 *   - Shows the scanned result or "No result yet".
 *   - Renders a `div` where the camera feed and QR scanner UI will be injected by `html5-qrcode`.
 *   - Provides a button to "Start Scanning" or "Stop Scanning" based on the current state.
 *
 * **Dependencies:**
 * - `react` (useEffect, useRef, useState)
 * - `html5-qrcode`
 * - `@mui/material` (Box, Typography, Button, Alert, Paper)
 * - `../features/logsSlice` (useLogAttendanceMutation)
 */
export function QrScanner({ userId, roomId }: { userId: string; roomId: string }) {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [logAttendance] = useLogAttendanceMutation();
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
                async (decodedText) => {
                    console.log("Scanned:", decodedText);

                    if (!decodedText || !isValidEmail(decodedText)) {
                        setError("This QR code is invalid or has expired. Please try again or generate a new one.");
                        stopScanner();
                        return;
                    }

                    setScanResult(decodedText);
                    await saveScanToBackend(decodedText); // Save the scan result to the backend
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

    const saveScanToBackend = async (email: string) => {
        try{
            const response = await logAttendance({ userId, roomId, email }).unwrap();
            console.log('Scan result saved:', response);
            setSuccess('Scan result saved successfully!');
        }
        catch (error) {
            console.error('Failed to save scan result:', error);
            setError('Failed to save scan result. Please try again.');
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
            {success && (
                <Alert severity="success" sx={{ width: '100%', maxWidth: 500 }}>{success}</Alert>
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