import React, { useState, useEffect } from 'react';
import './RestaurantList.css';
import {
  Box,
  Container,
  Typography,
  Chip,
  Rating,
  Button,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import TimerIcon from '@mui/icons-material/Timer';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const categories = [
  'Bowls',
  'Noodles',
  'Superbowl',
  'Keto and Salads',
  'Wraps',
  'Sandwiches',
  'Gourmet sandwiches',
  'Appetizers',
  'Desserts and Beverages',
  'Zero Rice Bowl',
  'Omelettes',
  'All day breakfast',
  'Subscriptions',
  'Meal Combo'
];

const filters = [
  { id: 'rating4', label: 'Ratings 4.0+' },
  { id: 'pureVeg', label: 'Pure Veg' },
  { id: 'offers', label: 'Offers' },
  { id: 'price300_600', label: 'Rs. 300-Rs. 600' },
  { id: 'lessThan300', label: 'Less than Rs. 300' },
];

const sortOptions = [
  { id: 'relevance', label: 'Relevance (Default)' },
  { id: 'rating', label: 'Rating: High to Low' },
  { id: 'deliveryTime', label: 'Delivery Time' },
  { id: 'costLowToHigh', label: 'Cost: Low to High' },
  { id: 'costHighToLow', label: 'Cost: High to Low' },
];

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // Handle filter selection
  const handleFilterClick = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Handle sort menu
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    handleSortClose();
  };

  // Simulated data fetching
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        // Replace this with actual API call once backend is ready
        const dummyRestaurants = [
          {
            id: 1,
            name: "PizzaExpress",
            image: "/images/restaurants/pizzaexpress-cover.jpg",
            rating: 4.0,
            deliveryTime: { min: 50, max: 55 },
            cuisine: ["Pizzas", "Fast Food"],
            location: "Guru Arjan Dev Nagar",
            offer: null
          },
          {
            id: 2,
            name: "Ghee Indian Kitchen",
            image: "/images/restaurants/ghee-indian-cover.jpg",
            rating: 3.5,
            deliveryTime: { min: 60, max: 65 },
            cuisine: ["Indian", "Home Food"],
            location: "Chaura Bazar",
            offer: "₹150 OFF ABOVE ₹999"
          },
          {
            id: 3,
            name: "Honey's Hygienic Food",
            image: "/images/restaurants/honeys-cover.jpg",
            rating: 4.3,
            deliveryTime: { min: 60, max: 65 },
            cuisine: ["Indian", "Snacks"],
            location: "Chaura Bazar",
            offer: "10% OFF ABOVE ₹350"
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRestaurants(dummyRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedFilters, selectedSort, selectedCategory]);

  return (
    <Box className="restaurant-list-container">
      <Container maxWidth="lg">
        <Box className="content-wrapper">
          {/* Categories Sidebar */}
          <Paper className="categories-sidebar">
            <Typography variant="h6" className="sidebar-title">
              CATEGORIES
            </Typography>
            <List component="nav">
              {categories.map((category) => (
                <ListItem
                  button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`category-item ${
                    selectedCategory === category ? 'selected' : ''
                  }`}
                >
                  <ListItemText primary={category} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Main Content */}
          <Box className="main-content">
            <Typography variant="h4" component="h1" className="page-title">
              Restaurants with online food delivery in Ludhiana
            </Typography>

            {/* Filters Section */}
            <Box className="filters-section">
              <Box className="filter-chips">
                {filters.map((filter) => (
                  <Chip
                    key={filter.id}
                    label={filter.label}
                    onClick={() => handleFilterClick(filter.id)}
                    className={`filter-chip ${
                      selectedFilters.includes(filter.id) ? 'selected' : ''
                    }`}
                  />
                ))}
              </Box>

              {/* Sort Button */}
              <Button
                startIcon={<SortIcon />}
                onClick={handleSortClick}
                className="sort-button"
              >
                Sort By: {selectedSort.label}
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
              >
                {sortOptions.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => handleSortSelect(option)}
                    selected={option.id === selectedSort.id}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Restaurant Cards */}
            <Box className="restaurant-grid">
              {loading ? (
                Array.from(new Array(8)).map((_, index) => (
                  <Box key={index} className="restaurant-card skeleton">
                    <Skeleton variant="rectangular" height={200} />
                    <Box sx={{ p: 2 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="80%" />
                    </Box>
                  </Box>
                ))
              ) : restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <Box key={restaurant.id} className="restaurant-card">
                    <Box className="restaurant-image">
                      <img src={restaurant.image} alt={restaurant.name} />
                      {restaurant.offer && (
                        <Box className="offer-tag">
                          <LocalOfferIcon />
                          {restaurant.offer}
                        </Box>
                      )}
                    </Box>
                    <Box className="restaurant-info">
                      <Typography variant="h6">{restaurant.name}</Typography>
                      <Box className="rating-time">
                        <Box className="rating">
                          <Rating value={restaurant.rating} readOnly precision={0.1} size="small" />
                          <Typography variant="body2">
                            {restaurant.rating}
                          </Typography>
                        </Box>
                        <Box className="delivery-time">
                          <TimerIcon />
                          {restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} mins
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.cuisine.join(", ")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.location}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box className="no-results">
                  <Typography variant="h6">
                    No restaurants found matching your criteria
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RestaurantList;
