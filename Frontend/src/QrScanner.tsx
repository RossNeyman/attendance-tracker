import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Container } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Height } from '@mui/icons-material';

export function QrScanner() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanResult, setScanResult] = useState<string | null>(null);


    useEffect(() => {
        // Request access to the camera
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Unable to access the camera. Please check your permissions.');
                console.error(err);
            }
        };

        getCameraStream();

        const scanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { height: 250, width: 250 },
            rememberLastUsedCamera: true,
        }, true);
    
        scanner.render(success, handleError);
    
        function success(decodedText: string, decodedResult: any) {
            // Handle the decoded text here
            setScanResult(decodedText);
            console.log(`Decoded text: ${decodedText}`, decodedResult);
        }
        function handleError(err: any) {
            // Handle the error here
            console.error(`Error scanning: ${err}`);
        }
    

        // Cleanup function to stop the camera when the component unmounts
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>{scanResult ? `Scanned Result: ${scanResult}` : 'No result yet' 
                }</h1>
            <div id="reader" style={{ width: '100%', height: '100vh' }}></div>
        </>
    );
}