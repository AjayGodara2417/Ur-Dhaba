import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingSpinner;
