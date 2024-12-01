import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Rating,
    Button,
} from '@mui/material';
import { Search, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    // Placeholder data for featured restaurants
    const featuredRestaurants = [
        {
            id: 1,
            name: 'Punjabi Dhaba',
            image: 'https://th.bing.com/th?id=OIP.d2m6TMXvxfrC3VPUpC9V5wHaEK&w=333&h=187&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2',
            cuisine: 'North Indian',
            rating: 4.5,
            deliveryTime: '30-40',
            priceRange: '₹200-400'
        },
        {
            id: 2,
            name: 'South Indian Express',
            image: 'https://th.bing.com/th?q=Indian+Dhaba+Gaur+City+2&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
            cuisine: 'South Indian',
            rating: 4.2,
            deliveryTime: '25-35',
            priceRange: '₹150-300'
        },
        {
            id: 3,
            name: 'Chinese Corner',
            image: 'https://th.bing.com/th/id/OIP.IFoKExjrdTTbpv-PdV-tPQHaE7?w=295&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            cuisine: 'Chinese',
            rating: 4.0,
            deliveryTime: '35-45',
            priceRange: '₹250-450'
        },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/restaurants', { state: { searchQuery, location } });
    };

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://wallpapercave.com/wp/wp1874166.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center',
                    mb: 6
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom>
                        Delicious Food at Your Doorstep
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Order from your favorite restaurants
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mt: 4,
                            flexDirection: { xs: 'column', md: 'row' }
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter your location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search for restaurants or cuisines"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            sx={{ px: 4, minWidth: { xs: '100%', md: 'auto' } }}
                        >
                            Search
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Featured Restaurants Section */}
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" gutterBottom>
                    Featured Restaurants
                </Typography>
                <Grid container spacing={4}>
                    {featuredRestaurants.map((restaurant) => (
                        <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        transition: 'transform 0.2s ease-in-out'
                                    }
                                }}
                                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={restaurant.image}
                                    alt={restaurant.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="h3">
                                        {restaurant.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {restaurant.cuisine}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            {restaurant.rating}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {restaurant.deliveryTime} mins • {restaurant.priceRange}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
