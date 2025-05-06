// src/components/NavBar.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("User logging out...");
        alert("Logging out...");
        navigate('/');
    };

    return (
        <AppBar
            position="sticky"
            elevation={1}
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
            }}
        >
            {/* Top Section: Logo Area (White Background) */}
            <Box sx={{
                backgroundColor: 'common.white',
                px: { xs: 2, sm: 3 },
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}>
                {/* --- Modified Toolbar --- */}
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'center', 
                    }}
                >
                    {/* Logo */}
                    <Typography
                        variant="h4" 
                        component={Link}
                        to="/home"
                        sx={{
                            fontFamily: '"Agbalumo", cursive',
                            fontWeight: 'normal',
                            textDecoration: 'none',
                        }}
                    >
                        <span style={{ color: '#cb2323' }}>Class</span>
                        <span style={{ color: '#2374cb' }}>TAP</span>
                    </Typography>
                </Toolbar>
                {/* --- End Modified Toolbar --- */}
            </Box>

            {/* Bottom Section: Navigation Links (Dark Background) */}
            <Box sx={{ backgroundColor: '#333333' }}>
                <Toolbar
                    variant="dense"
                    sx={{
                        display: 'flex',
                        justifyContent: { xs: 'space-around', sm: 'center' },
                        gap: { xs: 1, sm: 4 },
                        flexWrap: 'wrap',
                        minHeight: '48px',
                    }}
                >
                    {/* Navigation Buttons */}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/home"
                        sx={{ color: 'common.white', textTransform: 'uppercase', fontWeight: 'medium' }}
                    >
                        Home
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/account"
                        sx={{ color: 'common.white', textTransform: 'uppercase', fontWeight: 'medium' }}
                    >
                        Account Settings
                    </Button>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{ color: 'common.white', textTransform: 'uppercase', fontWeight: 'medium' }}
                    >
                        Log Out
                    </Button>
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default NavBar;