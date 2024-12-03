import React, { useState, useEffect } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    dispatch(login(formData));
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
            Sign In
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                New to Ur Dhaba?{' '}
                <Button
                  onClick={() => navigate('/signup')}
                  sx={{ textTransform: 'none', color: '#fc8019' }}
                >
                  Create Account
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn;
