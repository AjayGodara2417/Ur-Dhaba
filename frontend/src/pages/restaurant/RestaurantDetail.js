import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardMedia,
    Rating,
    Chip,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Alert,
} from '@mui/material';
import {
    AccessTime,
    LocationOn,
    Phone,
    ShoppingCart,
    Add,
    Remove,
    Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { fetchRestaurantById } from '../../redux/slices/restaurantSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const RestaurantDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedRestaurant: restaurant, loading, error } = useSelector((state) => state.restaurant);

    useEffect(() => {
        if (id) {
            dispatch(fetchRestaurantById(id));
        }
    }, [dispatch, id]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!restaurant?.data) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="info">Restaurant not found</Alert>
            </Container>
        );
    }

    const restaurantData = restaurant.data;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Restaurant Header */}
            <Paper elevation={2} sx={{ mb: 4, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', height: '300px' }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={restaurantData.image || 'https://via.placeholder.com/800x400?text=Restaurant+Image'}
                        alt={restaurantData.name}
                        sx={{ objectFit: 'cover' }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            p: 2,
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            {restaurantData.name}
                        </Typography>
                        <Typography variant="subtitle1">{restaurantData.cuisine}</Typography>
                    </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1" paragraph>
                                {restaurantData.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Rating 
                                    value={restaurantData.rating?.average || 0} 
                                    precision={0.1} 
                                    readOnly 
                                />
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    ({restaurantData.rating?.count || 0} reviews)
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {restaurantData.features?.hasParking && (
                                    <Chip label="Parking Available" color="primary" size="small" />
                                )}
                                {restaurantData.features?.hasAC && (
                                    <Chip label="Air Conditioned" color="primary" size="small" />
                                )}
                                {restaurantData.features?.hasWifi && (
                                    <Chip label="Free WiFi" color="primary" size="small" />
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <List>
                                <ListItem>
                                    <LocationOn sx={{ mr: 2 }} />
                                    <ListItemText
                                        primary="Address"
                                        secondary={`${restaurantData.address?.street}, ${restaurantData.address?.city}, ${restaurantData.address?.state} ${restaurantData.address?.zipCode}`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <AccessTime sx={{ mr: 2 }} />
                                    <ListItemText
                                        primary="Delivery Time"
                                        secondary={`${restaurantData.deliveryTime || '30-45'} minutes`}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Phone sx={{ mr: 2 }} />
                                    <ListItemText
                                        primary="Contact"
                                        secondary={restaurantData.phone || 'Not available'}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card elevation={3}>
                                <CardMedia
                                    component="div"
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                    }}
                                >
                                    <RestaurantIcon sx={{ fontSize: 100 }} />
                                </CardMedia>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Operating Hours
                                    </Typography>
                                    {restaurantData.operatingHours?.map((hours, index) => (
                                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">{hours.day}</Typography>
                                            <Typography variant="body2">
                                                {hours.open} - {hours.close}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<ShoppingCart />}
                                        sx={{ mt: 2 }}
                                        disabled={!restaurantData.isOpen}
                                    >
                                        {restaurantData.isOpen ? 'Start Order' : 'Currently Closed'}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default RestaurantDetail;
