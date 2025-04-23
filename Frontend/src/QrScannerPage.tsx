import * as React from 'react';
import NavBar from './components/NavBar';
import { QrScanner } from './components/QrScanner';
import { Button } from '@mui/material';

export function QrScannerPage() {
    return (
        <div>
            <NavBar />
            <Button variant="contained" color="primary" onClick={() => window.location.reload()} style={{ margin: '20px' }}>
                Exit to Login 
            </Button>
            {<QrScanner />}
        </div>
    );
}