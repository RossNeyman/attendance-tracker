import * as React from 'react';
import { useGetDogImageQuery } from '../features/dogsSlice';
import { Typography, Box, Paper, CircularProgress, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * DogError Component
 * Displays a cute dog image with an error message when something goes wrong
 */
const DogError: React.FC = () => {
    const { data: dogImage, refetch: setDogImage, isLoading, error, isSuccess } = useGetDogImageQuery(undefined);

    React.useEffect(() => {
        setDogImage();
    }, [setDogImage]);

    if (error) {
        console.log("Dog error image failed to load");
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                p: 3 
            }}>
                <Typography color="error">Unable to load error image</Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                p: 3 
            }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    if (isSuccess && dogImage && dogImage[0]) {
        return (
            <Paper 
                elevation={3} 
                sx={{ 
                    maxWidth: 500, 
                    mx: 'auto', 
                    p: 3, 
                    borderRadius: 2,
                    textAlign: 'center',
                    backgroundColor: '#fff8e1'
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
                    
                    <Typography variant="h5" color="error" gutterBottom>
                        Oops! Something Went Wrong
                    </Typography>
                    
                    <Box 
                        component="img" 
                        src={dogImage[0].url} 
                        alt="Error Dog"
                        sx={{ 
                            maxWidth: '100%', 
                            maxHeight: 300, 
                            borderRadius: 2,
                            boxShadow: 3
                        }} 
                    />
                    
                    <Typography variant="body1">
                        We're having trouble loading this content. 
                        Please try again later while this cute pup keeps you company.
                    </Typography>
                </Stack>
            </Paper>
        );
    }
    
    return null;
}

export default DogError;