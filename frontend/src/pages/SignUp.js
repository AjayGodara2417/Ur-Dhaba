import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const defaultUserType = location.state?.userType || 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: defaultUserType
  });

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        dispatch(reset());
      }, 3000);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
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
          {isError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {message}
            </Alert>
          )}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              type="tel"
              id="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="role-label">I'm a</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="I'm a"
                onChange={handleChange}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="restaurant">Restaurant Owner</MenuItem>
                <MenuItem value="delivery">Delivery Partner</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                bgcolor: '#fc8019',
                '&:hover': {
                  bgcolor: '#e27312'
                }
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{ textTransform: 'none', color: '#fc8019' }}
                >
                  Sign In
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
