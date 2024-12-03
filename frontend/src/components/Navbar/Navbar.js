import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const pages = [
  { name: 'Partner with us', type: 'restaurant' },
  { name: 'Deliver with us', type: 'delivery' }
];

function Navbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavClick = (type) => {
    handleCloseNavMenu();
    navigate('/signup', { state: { userType: type } });
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <AppBar position="fixed" sx={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for larger screens */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <RestaurantIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#fc8019' }} />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#fc8019',
                textDecoration: 'none',
              }}
            >
              UR DHABA
            </Typography>
          </Link>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#fc8019' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => handleNavClick(page.type)}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#fff3e6',
                      color: '#fc8019'
                    }
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for mobile */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
            <RestaurantIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#fc8019' }} />
            <Typography
              variant="h5"
              noWrap
              sx={{
                display: { xs: 'flex', md: 'none' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#fc8019',
                textDecoration: 'none',
              }}
            >
              UR DHABA
            </Typography>
          </Link>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavClick(page.type)}
                sx={{
                  color: '#282c3f',
                  display: 'block',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#fff3e6',
                    color: '#fc8019'
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Sign In Button */}
          <Button
            onClick={handleSignIn}
            sx={{
              ml: 2,
              backgroundColor: '#fc8019',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#e06c0f',
              },
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(252, 128, 25, 0.2)',
            }}
          >
            Sign In
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
