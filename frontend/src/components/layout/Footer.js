import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.grey[100],
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Ur Dhaba
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your favorite food, delivered hot and fresh to your doorstep.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Quick Links
                        </Typography>
                        <Box>
                            <Link
                                component={RouterLink}
                                to="/about"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                About Us
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/contact"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                Contact Us
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/partner-with-us"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                Partner with Us
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Legal
                        </Typography>
                        <Box>
                            <Link
                                component={RouterLink}
                                to="/terms"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                Terms of Service
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/privacy"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 1 }}
                            >
                                Privacy Policy
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Ur Dhaba. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
