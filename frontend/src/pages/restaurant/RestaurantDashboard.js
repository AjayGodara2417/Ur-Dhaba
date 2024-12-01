import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Snackbar
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Restaurant as RestaurantIcon,
    AccessTime as TimeIcon,
    AccountBalance as BankIcon,
} from '@mui/icons-material';
import {
    fetchOwnerRestaurants,
    updateRestaurant,
    deleteRestaurant,
    toggleRestaurantStatus,
    createRestaurant,
} from '../../redux/slices/restaurantSlice';

const CUISINES = ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Continental', 'Fast Food'];
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];

const initialFormData = {
    name: '',
    description: '',
    cuisine: '',
    address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
    },
    image: '',
    priceRange: '',
    deliveryTime: '',
    features: {
        hasParking: false,
        hasAC: false,
        hasWifi: false,
    }
};

const RestaurantDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { restaurants, loading, error, success } = useSelector((state) => state.restaurant);
    
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [formData, setFormData] = useState(initialFormData);
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (user?.role === 'restaurant') {
            dispatch(fetchOwnerRestaurants());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (selectedRestaurant) {
            setFormData(selectedRestaurant);
        } else {
            setFormData(initialFormData);
        }
    }, [selectedRestaurant]);

    useEffect(() => {
        if (success) {
            handleCloseDialog();
            setSnackbar({ open: true, message: 'Operation successful', severity: 'success' });
        }
    }, [success]);

    const handleOpenDialog = (restaurant = null) => {
        setSelectedRestaurant(restaurant);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setSelectedRestaurant(null);
        setOpenDialog(false);
        setFormData(initialFormData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFeatureToggle = (feature) => {
        setFormData((prev) => ({
            ...prev,
            features: {
                ...prev.features,
                [feature]: !prev.features[feature],
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedRestaurant) {
                await dispatch(updateRestaurant({ id: selectedRestaurant._id, ...formData })).unwrap();
            } else {
                await dispatch(createRestaurant(formData)).unwrap();
            }
            handleCloseDialog();
            dispatch(fetchOwnerRestaurants());
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: 'error' });
        }
    };

    const handleDeleteRestaurant = async (id) => {
        try {
            await dispatch(deleteRestaurant(id)).unwrap();
            dispatch(fetchOwnerRestaurants());
            setSnackbar({ open: true, message: 'Restaurant deleted successfully', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: 'error' });
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await dispatch(toggleRestaurantStatus({ id, isOpen: !currentStatus })).unwrap();
            dispatch(fetchOwnerRestaurants());
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: 'error' });
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
            <CircularProgress />
        </Box>
    );

    if (!user || user.role !== 'restaurant') {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    Access denied. Only restaurant owners can access this page.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Restaurant Dashboard
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Restaurant
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {restaurants?.map((restaurant) => (
                    <Grid item xs={12} md={6} lg={4} key={restaurant._id}>
                        <Card>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" component="h2">
                                        {restaurant.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(restaurant)}
                                            aria-label="edit"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDeleteRestaurant(restaurant._id)}
                                            aria-label="delete"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography color="textSecondary" gutterBottom>
                                    {restaurant.cuisine}
                                </Typography>
                                <Box mt={2}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={restaurant.isOpen}
                                                onChange={() => handleToggleStatus(restaurant._id, restaurant.isOpen)}
                                                color="primary"
                                            />
                                        }
                                        label={restaurant.isOpen ? 'Open' : 'Closed'}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    label="Restaurant Name"
                                    fullWidth
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Cuisine</InputLabel>
                                    <Select
                                        name="cuisine"
                                        value={formData.cuisine}
                                        onChange={handleInputChange}
                                        label="Cuisine"
                                    >
                                        {CUISINES.map((cuisine) => (
                                            <MenuItem key={cuisine} value={cuisine}>
                                                {cuisine}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Price Range</InputLabel>
                                    <Select
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleInputChange}
                                        label="Price Range"
                                    >
                                        {PRICE_RANGES.map((range) => (
                                            <MenuItem key={range} value={range}>
                                                {range}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Features
                                </Typography>
                                <Box>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.features.hasParking}
                                                onChange={() => handleFeatureToggle('hasParking')}
                                            />
                                        }
                                        label="Parking Available"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.features.hasAC}
                                                onChange={() => handleFeatureToggle('hasAC')}
                                            />
                                        }
                                        label="Air Conditioning"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.features.hasWifi}
                                                onChange={() => handleFeatureToggle('hasWifi')}
                                            />
                                        }
                                        label="Free WiFi"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {selectedRestaurant ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RestaurantDashboard;
