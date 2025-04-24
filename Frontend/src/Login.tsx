import * as React from 'react';
import NavBar from './components/NavBar';
import { Box, Typography, TextField, Button, Divider, useTheme } from '@mui/material';

// Reusable LoginForm component
function LoginForm({ title }: { title: string }) {
    return (
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
                {title}
            </Typography>
            <TextField
                label="Email"
                variant="outlined"
                sx={{ marginBottom: 2, width: '300px' }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                sx={{ marginBottom: 2, width: '300px' }}
            />
            <Button variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    );
}

export function Login() {
    const theme = useTheme(); // Access the Material-UI theme

    return (
        <>
            <NavBar />
            <LoginForm title="Login" />
            <Divider
                sx={{
                    marginTop: 4,
                    backgroundColor: theme.palette.primary.main, // Use the NavBar's primary color
                    height: '2px',
                }}
            />
            <LoginForm title="Login to use device as Scanner" />
        </>
    );
}