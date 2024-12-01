import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert,
    Paper,
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import useRestaurantFilters from '../../hooks/useRestaurantFilters';
import { fetchRestaurants } from '../../redux/slices/restaurantSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RestaurantList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { restaurants, loading, error } = useSelector((state) => state.restaurant);
    
    const [filters, setFilters] = useState({
        search: location.state?.searchQuery || '',
        cuisine: '',
        rating: '',
        priceRange: ''
    });

    useEffect(() => {
        dispatch(fetchRestaurants());
    }, [dispatch]);

    useEffect(() => {
        if (location.state?.searchQuery) {
            setFilters(prev => ({ ...prev, search: location.state.searchQuery }));
        }
    }, [location.state?.searchQuery]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const filteredRestaurants = React.useMemo(() => {
        if (!restaurants?.data) return [];
        
        return restaurants.data.filter(restaurant => {
            const matchesSearch = !filters.search || 
                restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                restaurant.cuisine.toLowerCase().includes(filters.search.toLowerCase());
            
            const matchesCuisine = !filters.cuisine || restaurant.cuisine === filters.cuisine;
            
            const matchesRating = !filters.rating || 
                (restaurant.rating?.average >= parseFloat(filters.rating));
            
            const matchesPriceRange = !filters.priceRange || 
                restaurant.priceRange === filters.priceRange;

            return matchesSearch && matchesCuisine && matchesRating && matchesPriceRange;
        });
    }, [restaurants?.data, filters]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Filters Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search restaurants or cuisines"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Cuisine</InputLabel>
                                    <Select
                                        value={filters.cuisine}
                                        label="Cuisine"
                                        onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="North Indian">North Indian</MenuItem>
                                        <MenuItem value="South Indian">South Indian</MenuItem>
                                        <MenuItem value="Chinese">Chinese</MenuItem>
                                        <MenuItem value="Fast Food">Fast Food</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Rating</InputLabel>
                                    <Select
                                        value={filters.rating}
                                        label="Rating"
                                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="4.5">4.5+</MenuItem>
                                        <MenuItem value="4.0">4.0+</MenuItem>
                                        <MenuItem value="3.5">3.5+</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Price Range</InputLabel>
                                    <Select
                                        value={filters.priceRange}
                                        label="Price Range"
                                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="$">$</MenuItem>
                                        <MenuItem value="$$">$$</MenuItem>
                                        <MenuItem value="$$$">$$$</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results Section */}
            {filteredRestaurants.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No restaurants found matching your criteria
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {filteredRestaurants.map((restaurant) => (
                        <Grid item key={restaurant._id} xs={12} sm={6} md={4}>
                            <RestaurantCard restaurant={restaurant} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default RestaurantList;
