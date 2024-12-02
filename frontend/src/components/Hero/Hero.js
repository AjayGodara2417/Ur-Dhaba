import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Hero.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { CircularProgress, Autocomplete, TextField } from '@mui/material';

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Function to get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            const address = response.data.results[0].formatted;
            setLocation(address);
            setUserLocation({ latitude, longitude });
          } catch (error) {
            console.error('Error getting location:', error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  // Function to search restaurants and menu items
  const searchRestaurantsAndItems = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/search?query=${query}&location=${location}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchRestaurantsAndItems(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search result selection
  const handleResultSelect = (result) => {
    if (result.type === 'restaurant') {
      navigate(`/restaurant/${result._id}`);
    } else if (result.type === 'menuItem') {
      navigate(`/restaurant/${result.restaurantId}?item=${result._id}`);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Order food & groceries. Discover<br />
          best restaurants. Dhaba it!
        </h1>
        
        <div className="search-container">
          <div className="location-input">
            <LocationOnIcon className="location-icon" />
            <input
              type="text"
              placeholder="Enter your delivery location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button 
              className="locate-btn" 
              onClick={getUserLocation}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Locate Me'}
            </button>
          </div>
          
          <div className="search-input">
            <SearchIcon className="search-icon" />
            <Autocomplete
              freeSolo
              options={searchResults}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.name
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <div className="search-result-item">
                    {option.type === 'restaurant' ? (
                      <RestaurantIcon sx={{ mr: 1 }} />
                    ) : (
                      <DeliveryDiningIcon sx={{ mr: 1 }} />
                    )}
                    <div>
                      <div>{option.name}</div>
                      <small>
                        {option.type === 'restaurant' 
                          ? option.cuisine.join(', ') 
                          : `${option.restaurantName} • ${option.category}`}
                      </small>
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for restaurant, item or more"
                  variant="standard"
                  fullWidth
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}
              onChange={(event, value) => {
                if (value && typeof value !== 'string') {
                  handleResultSelect(value);
                }
              }}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="service-cards">
        <div className="service-card">
          <div>
            <h2>FOOD DELIVERY</h2>
            <p>FROM RESTAURANTS</p>
            <span className="offer">UPTO 60% OFF</span>
          </div>
          <DeliveryDiningIcon sx={{ fontSize: 80, color: '#fc8019', marginLeft: 'auto' }} />
        </div>

        <div className="service-card">
          <div>
            <h2>DINEOUT</h2>
            <p>EAT OUT & SAVE MORE</p>
            <span className="offer">UPTO 50% OFF</span>
          </div>
          <RestaurantIcon sx={{ fontSize: 80, color: '#fc8019', marginLeft: 'auto' }} />
        </div>

        <div className="service-card">
          <div>
            <h2>GENIE</h2>
            <p>PICK-UP & DROP</p>
          </div>
          <LocalShippingIcon sx={{ fontSize: 80, color: '#fc8019', marginLeft: 'auto' }} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
