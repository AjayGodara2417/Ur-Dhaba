import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Badge,
} from '@mui/material';
import { ShoppingCart, Person } from '@mui/icons-material';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleCloseMenu();
        navigate('/');
    };

    return (
        <AppBar position="fixed" color="default" elevation={1}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: 'flex',
                            fontWeight: 700,
                            color: 'primary.main',
                            textDecoration: 'none',
                        }}
                    >
                        Ur Dhaba
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {isAuthenticated ? (
                        <>
                            <IconButton
                                component={RouterLink}
                                to="/cart"
                                color="inherit"
                                sx={{ mr: 2 }}
                            >
                                <Badge badgeContent={items.length} color="primary">
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>

                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenMenu}>
                                    <Avatar alt={user?.name} src={user?.profileImage} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                            >
                                <MenuItem
                                    component={RouterLink}
                                    to="/profile"
                                    onClick={handleCloseMenu}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    component={RouterLink}
                                    to="/orders"
                                    onClick={handleCloseMenu}
                                >
                                    My Orders
                                </MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                component={RouterLink}
                                to="/login"
                                color="inherit"
                                startIcon={<Person />}
                            >
                                Login
                            </Button>
                            <Button
                                component={RouterLink}
                                to="/register"
                                variant="contained"
                                color="primary"
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
