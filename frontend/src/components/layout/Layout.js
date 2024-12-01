import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Navbar />
            <Container
                component="main"
                maxWidth="xl"
                sx={{
                    flexGrow: 1,
                    py: 12,
                    px: { xs: 2, md: 3 },
                }}
            >
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout;
