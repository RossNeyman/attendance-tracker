import * as React from 'react';
import NavBar from './components/NavBar';
import { Box, Typography, Divider, useTheme, Grid, IconButton } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export function Home() {
    const theme = useTheme(); // Access the Material-UI theme

    // Example room data
    const rooms = [
        { id: 1, name: 'Room A' },
        { id: 2, name: 'Room B' },
        { id: 3, name: 'Room C' },
    ];

    return (
        <>
            <NavBar />
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 4,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Home
                </Typography>
                <Divider 
                    sx={{ 
                        marginTop: 2, 
                        marginBottom: 4, 
                        backgroundColor: theme.palette.primary.main, 
                        height: '2px', 
                        width: '80%' 
                    }} 
                />
                <Grid container spacing={2} justifyContent="center">
                    {rooms.map((room) => (
                        <Grid item xs={12} key={room.id}>
                            <Box 
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <IconButton 
                                    color="primary" 
                                    sx={{ fontSize: 48 }}
                                >
                                    <MeetingRoomIcon fontSize="inherit" />
                                </IconButton>
                                <Typography variant="body1">{room.name}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
}