import * as React from 'react';
import NavBar from './components/NavBar';
import { Box, Typography, TextField, Button, Divider, useTheme } from '@mui/material';

export function Home() {
    const theme = useTheme(); // Access the Material-UI theme

    return (
        <>
            <NavBar />
            <Typography>Home</Typography>
            <Divider 
                sx={{ 
                    marginTop: 4, 
                    backgroundColor: theme.palette.primary.main, // Use the NavBar's primary color
                    height: '2px' 
                }} 
            />

        </>
    );
}