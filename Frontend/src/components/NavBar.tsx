import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import * as React from 'react';

const NavBar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Attendance Tracker
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/home"
                    >
                        Home
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/scanner"
                    >
                        Scanner
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;