import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function QrScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const qrRegionId = 'qr-reader';

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
                    setScanResult(decodedText);
                    stopScanner(); // stop after success
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
            stopScanner(); // clean up if navigating away
        };
    }, []);

    return (
        <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h1>{scanResult ? `Scanned Result: ${scanResult}` : 'No result yet'}</h1>

            <div id={qrRegionId} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                {!isScanning ? (
                    <button onClick={startScanner}>Start Scanning</button>
                ) : (
                    <button onClick={stopScanner}>Stop Scanning</button>
                )}
            </div>
        </>
    );
}
