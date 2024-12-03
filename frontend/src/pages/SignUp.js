import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const defaultUserType = location.state?.userType || 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: defaultUserType
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up data:', formData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2, borderRadius: 2 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3, color: '#282c3f', textAlign: 'center' }}>
            Create Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="user-type-label">I want to</InputLabel>
              <Select
                labelId="user-type-label"
                id="userType"
                name="userType"
                value={formData.userType}
                label="I want to"
                onChange={handleChange}
              >
                <MenuItem value="customer">Order Food</MenuItem>
                <MenuItem value="restaurant">List My Restaurant</MenuItem>
                <MenuItem value="delivery">Become a Delivery Partner</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: '#fc8019',
                '&:hover': {
                  backgroundColor: '#e06c0f',
                },
                textTransform: 'none',
                py: 1.5,
              }}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              onClick={() => navigate('/signin')}
              sx={{
                color: '#fc8019',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(252, 128, 25, 0.1)',
                },
              }}
            >
              Already have an account? Sign In
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
