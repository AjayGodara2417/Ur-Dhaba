import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Chip,
  Card,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  Paper,
  List,
  Button,
  Skeleton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import TimerIcon from '@mui/icons-material/Timer';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

const useStyles = makeStyles(() => ({
  root: {
    padding: '24px',
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
  },
  pageContainer: {
    display: 'flex',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 16px',
  },
  categoriesSidebar: {
    width: '280px',
    height: 'fit-content',
    backgroundColor: '#fff',
    borderRadius: '12px',
    position: 'sticky',
    top: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '16px 0',
  },
  categoryItem: {
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&.selected': {
      backgroundColor: '#ff4d4d15',
      color: '#ff4d4d',
      fontWeight: 600,
    },
  },
  mainContent: {
    flex: 1,
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  filterContainer: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    padding: '8px 0',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '10px',
      '&:hover': {
        background: '#555',
      },
    },
  },
  filterChip: {
    transition: 'all 0.3s ease',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    '&:hover': {
      backgroundColor: '#ff4d4d15',
      borderColor: '#ff4d4d',
    },
    '&.Mui-selected': {
      backgroundColor: '#ff4d4d',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#ff3333',
      },
    },
  },
  sortButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#ff4d4d15',
      borderColor: '#ff4d4d',
      color: '#ff4d4d',
    },
  },
  restaurantGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  restaurantCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    border: '1px solid #e0e0e0',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    },
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardContent: {
    padding: '16px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  restaurantName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1c1c1c',
    marginBottom: '4px',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ff4d4d',
  },
  ratingBadge: {
    backgroundColor: '#ff4d4d15',
    color: '#ff4d4d',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cuisineText: {
    color: '#686b78',
    fontSize: '0.875rem',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '8px',
    color: '#686b78',
    fontSize: '0.875rem',
  },
  categoryTitle: {
    padding: '16px 24px',
    fontWeight: 600,
    color: '#1c1c1c',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '8px',
  },
}));

const RestaurantCard = ({ restaurant }) => {
  const classes = useStyles();

  return (
    <Card className={classes.restaurantCard} elevation={0}>
      <div className={classes.imageContainer}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={classes.restaurantImage}
        />
        {restaurant.offer && (
          <div className={classes.offerBadge}>
            <LocalOfferIcon fontSize="small" />
            <Typography className={classes.offerText}>
              {restaurant.offer}
            </Typography>
          </div>
        )}
      </div>
      <div className={classes.cardContent}>
        <Typography className={classes.restaurantName}>
          {restaurant.name}
        </Typography>
        <div className={classes.ratingContainer}>
          <Rating 
            value={restaurant.rating} 
            readOnly 
            precision={0.1}
            size="small"
          />
          <Typography variant="body2" className={classes.ratingText}>
            {restaurant.rating}
          </Typography>
        </div>
        <Typography className={classes.cuisineText}>
          {restaurant.cuisine.join(', ')}
        </Typography>
        <div className={classes.infoContainer}>
          <div className={classes.timeInfo}>
            <TimerIcon fontSize="small" />
            <span>{restaurant.deliveryTime.min}-{restaurant.deliveryTime.max} mins</span>
          </div>
          <div className={classes.dot}></div>
          <div className={classes.costInfo}>
            <span>₹{restaurant.priceRange} for two</span>
          </div>
        </div>
        <div className={classes.locationInfo}>
          <LocationOnIcon fontSize="small" className={classes.locationIcon} />
          <Typography className={classes.locationText}>
            {restaurant.location}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

const RestaurantList = () => {
  const classes = useStyles();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle sort menu
  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (sortId) => {
    setSelectedSort(sortId);
    handleSortClose();
  };

  // Handle filter selection
  const handleFilterClick = (filterId) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
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
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
            rating: 4.0,
            deliveryTime: { min: 50, max: 55 },
            cuisine: ["Pizzas", "Fast Food"],
            location: "Guru Arjan Dev Nagar, Ludhiana",
            offer: null,
            isVeg: false,
            priceRange: 400
          },
          {
            id: 2,
            name: "Ghee Indian Kitchen",
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
            rating: 3.5,
            deliveryTime: { min: 60, max: 65 },
            cuisine: ["Indian", "Home Food"],
            location: "Chaura Bazar, Ludhiana",
            offer: "₹150 OFF ABOVE ₹999",
            isVeg: true,
            priceRange: 250
          },
          {
            id: 3,
            name: "Honey's Hygienic Food",
            image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
            rating: 4.3,
            deliveryTime: { min: 60, max: 65 },
            cuisine: ["Indian", "Snacks"],
            location: "Chaura Bazar, Ludhiana",
            offer: "10% OFF ABOVE ₹350",
            isVeg: true,
            priceRange: 500
          },
          {
            id: 4,
            name: "Biryani House",
            image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
            rating: 4.5,
            deliveryTime: { min: 45, max: 50 },
            cuisine: ["Biryani", "Mughlai"],
            location: "Connaught Place, Delhi",
            offer: "20% OFF ABOVE ₹500",
            isVeg: false,
            priceRange: 450
          },
          {
            id: 5,
            name: "South Indian Delight",
            image: "https://images.unsplash.com/photo-1630383249896-424e482df921",
            rating: 4.2,
            deliveryTime: { min: 30, max: 40 },
            cuisine: ["South Indian", "Dosa"],
            location: "Indiranagar, Bangalore",
            offer: "Free Delivery",
            isVeg: true,
            priceRange: 200
          },
          {
            id: 6,
            name: "Chinese Wok",
            image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43",
            rating: 3.8,
            deliveryTime: { min: 40, max: 50 },
            cuisine: ["Chinese", "Thai"],
            location: "Salt Lake, Kolkata",
            offer: null,
            isVeg: false,
            priceRange: 350
          },
          {
            id: 7,
            name: "Mumbai Street Food",
            image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
            rating: 4.6,
            deliveryTime: { min: 25, max: 35 },
            cuisine: ["Street Food", "Chaat"],
            location: "Juhu, Mumbai",
            offer: "Buy 1 Get 1 Free",
            isVeg: true,
            priceRange: 150
          },
          {
            id: 8,
            name: "Punjabi Dhaba",
            image: "https://images.unsplash.com/photo-1628294895950-9805252327bc",
            rating: 4.4,
            deliveryTime: { min: 35, max: 45 },
            cuisine: ["North Indian", "Punjabi"],
            location: "Sector 17, Chandigarh",
            offer: "30% OFF on First Order",
            isVeg: true,
            priceRange: 300
          },
          {
            id: 9,
            name: "Sushi Paradise",
            image: "https://images.unsplash.com/photo-1579871494447-e0cb75fb8d3a",
            rating: 4.7,
            deliveryTime: { min: 55, max: 65 },
            cuisine: ["Japanese", "Sushi"],
            location: "Bandra, Mumbai",
            offer: null,
            isVeg: false,
            priceRange: 800
          },
          {
            id: 10,
            name: "Healthy Bowl",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
            rating: 4.3,
            deliveryTime: { min: 30, max: 40 },
            cuisine: ["Salads", "Healthy Food"],
            location: "HSR Layout, Bangalore",
            offer: "15% OFF on Salads",
            isVeg: true,
            priceRange: 350
          },
          {
            id: 11,
            name: "Kebab Corner",
            image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143",
            rating: 4.1,
            deliveryTime: { min: 45, max: 55 },
            cuisine: ["Kebabs", "BBQ"],
            location: "Park Street, Kolkata",
            offer: "Combo Offers Available",
            isVeg: false,
            priceRange: 550
          },
          {
            id: 12,
            name: "Dosa Factory",
            image: "https://images.unsplash.com/photo-1630383249896-424e482df921",
            rating: 4.5,
            deliveryTime: { min: 25, max: 35 },
            cuisine: ["South Indian", "Dosa"],
            location: "T Nagar, Chennai",
            offer: "Free Chutney on Orders Above ₹300",
            isVeg: true,
            priceRange: 200
          },
          {
            id: 13,
            name: "Burger King",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
            rating: 3.9,
            deliveryTime: { min: 30, max: 40 },
            cuisine: ["Burgers", "Fast Food"],
            location: "MG Road, Bangalore",
            offer: "Combo Meals at ₹199",
            isVeg: false,
            priceRange: 250
          },
          {
            id: 14,
            name: "Thali House",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
            rating: 4.4,
            deliveryTime: { min: 40, max: 50 },
            cuisine: ["North Indian", "Thali"],
            location: "Civil Lines, Delhi",
            offer: "Special Lunch Combo",
            isVeg: true,
            priceRange: 300
          },
          {
            id: 15,
            name: "Pasta Palace",
            image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
            rating: 4.2,
            deliveryTime: { min: 45, max: 55 },
            cuisine: ["Italian", "Pasta"],
            location: "Koregaon Park, Pune",
            offer: null,
            isVeg: false,
            priceRange: 450
          },
          {
            id: 16,
            name: "Momos Point",
            image: "https://images.unsplash.com/photo-1534422298391-e0cb75fb8d3a",
            rating: 4.0,
            deliveryTime: { min: 25, max: 35 },
            cuisine: ["Tibetan", "Chinese"],
            location: "Majnu ka Tila, Delhi",
            offer: "Buy 2 Get 1 Free",
            isVeg: false,
            priceRange: 150
          },
          {
            id: 17,
            name: "Sweet Bengal",
            image: "https://images.unsplash.com/photo-1605197584547-c54f1a88a727",
            rating: 4.6,
            deliveryTime: { min: 30, max: 40 },
            cuisine: ["Sweets", "Bengali"],
            location: "Gariahat, Kolkata",
            offer: "Festival Special Offers",
            isVeg: true,
            priceRange: 400
          },
          {
            id: 18,
            name: "Seafood Express",
            image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62",
            rating: 4.3,
            deliveryTime: { min: 50, max: 60 },
            cuisine: ["Seafood", "Coastal"],
            location: "Fort Kochi, Kerala",
            offer: "20% OFF on First Order",
            isVeg: false,
            priceRange: 700
          },
          {
            id: 19,
            name: "Paratha Junction",
            image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
            rating: 4.1,
            deliveryTime: { min: 35, max: 45 },
            cuisine: ["North Indian", "Breakfast"],
            location: "Aundh, Pune",
            offer: "Breakfast Combo at ₹149",
            isVeg: true,
            priceRange: 200
          },
          {
            id: 20,
            name: "Ice Cream Paradise",
            image: "https://images.unsplash.com/photo-1576506295286-5cda18df43e7",
            rating: 4.5,
            deliveryTime: { min: 20, max: 30 },
            cuisine: ["Desserts", "Ice Cream"],
            location: "Bandra, Mumbai",
            offer: "Buy 1 Get 1 on Sundaes",
            isVeg: true,
            priceRange: 250
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
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...restaurants];

    // Apply filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(restaurant => {
        return selectedFilters.every(filter => {
          switch (filter) {
            case 'rating4':
              return restaurant.rating >= 4.0;
            case 'pureVeg':
              return restaurant.isVeg;
            case 'offers':
              return restaurant.offer !== null;
            case 'price300_600':
              return restaurant.priceRange >= 300 && restaurant.priceRange <= 600;
            case 'lessThan300':
              return restaurant.priceRange < 300;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (selectedSort !== '') {
      filtered.sort((a, b) => {
        switch (selectedSort) {
          case 'rating':
            return b.rating - a.rating;
          case 'deliveryTime':
            return a.deliveryTime.min - b.deliveryTime.min;
          case 'costLowToHigh':
            return a.priceRange - b.priceRange;
          case 'costHighToLow':
            return b.priceRange - a.priceRange;
          default:
            return 0;
        }
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine.includes(selectedCategory)
      );
    }

    setFilteredRestaurants(filtered);
  }, [restaurants, selectedFilters, selectedSort, selectedCategory]);

  return (
    <div className={classes.root}>
      <div className={classes.pageContainer}>
        {/* Categories Sidebar */}
        <Paper elevation={0} className={classes.categoriesSidebar}>
          <Typography className={classes.categoryTitle}>Categories</Typography>
          <List disablePadding>
            {categories.map((category) => (
              <ListItem
                key={category}
                className={clsx(classes.categoryItem, {
                  selected: selectedCategory === category,
                })}
                onClick={() => setSelectedCategory(category)}
              >
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Content */}
        <div className={classes.mainContent}>
          {/* Filters Section */}
          <Paper elevation={0} className={classes.filterSection}>
            <div className={classes.filterContainer}>
              {filters.map((filter) => (
                <Chip
                  key={filter.id}
                  label={filter.label}
                  onClick={() => handleFilterClick(filter.id)}
                  className={classes.filterChip}
                  variant={selectedFilters.includes(filter.id) ? "filled" : "outlined"}
                  color={selectedFilters.includes(filter.id) ? "primary" : "default"}
                />
              ))}
              <Button
                className={classes.sortButton}
                onClick={handleSortClick}
                startIcon={<SortIcon />}
              >
                Sort By
              </Button>
            </div>
          </Paper>

          {/* Restaurant Grid */}
          <div className={classes.restaurantGrid}>
            {loading ? (
              // Skeleton loading state
              Array.from(new Array(8)).map((_, index) => (
                <Card key={index} className={classes.restaurantCard}>
                  <Skeleton 
                    variant="rectangular" 
                    className={classes.imageContainer}
                  />
                  <Box sx={{ p: 2 }}>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="60%" height={24} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="30%" height={24} />
                    </Box>
                  </Box>
                </Card>
              ))
            ) : filteredRestaurants.length === 0 ? (
              <Typography variant="h6" align="center">
                No restaurants found matching your criteria
              </Typography>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sort Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSortClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleSortSelect(option.id)}
            selected={selectedSort === option.id}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default RestaurantList;
