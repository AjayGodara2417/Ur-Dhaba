import React, { useRef } from 'react';
import './FeaturedRestaurants.css';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const restaurants = [
  {
    id: 1,
    name: 'Barbeque Nation',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    cuisine: 'North Indian • Chinese',
    location: 'Dhanraj Singh Complex, Rajguru Nagar',
    price: '₹1850 for two',
    distance: '20.6 km',
    offers: ['Up to 15% off with bank offers', 'Flat 10% off on pre-booking'],
    features: ['Table booking']
  },
  {
    id: 2,
    name: 'Bon Gateau',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    cuisine: 'Asian • Continental',
    location: 'Gurdev Nagar, Ludhiana',
    price: '₹1200 for two',
    distance: '18.7 km',
    offers: ['Up to 15% off with bank offers', 'Flat 10% off on pre-booking'],
    features: ['Table booking']
  },
  {
    id: 3,
    name: 'Banq By J9',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    rating: 4.1,
    cuisine: 'Continental • North Indian',
    location: 'Ayali Khurd, Ludhiana',
    price: '₹1000 for two',
    distance: '23.9 km',
    offers: ['Up to 15% off with bank offers', 'Flat 10% off on pre-booking', 'Get extra 10% off using TRYNEW'],
    features: ['Table booking']
  },
  {
    id: 4,
    name: 'Hot Breads',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    cuisine: 'Continental • North Indian',
    location: 'Kipps Market, Sarabha Nagar',
    price: '₹800 for two',
    distance: '15.2 km',
    offers: ['Up to 15% off with bank offers', 'Flat 25% off on pre-booking'],
    features: ['Table booking', 'Free Dish']
  }
];

const FeaturedRestaurants = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="featured-section">
      <div className="featured-header">
        <h2>Discover best restaurants on Dineout</h2>
        <div className="scroll-buttons">
          <button className="scroll-button" onClick={() => scroll('left')} aria-label="Previous">
            <NavigateBeforeIcon />
          </button>
          <button className="scroll-button" onClick={() => scroll('right')} aria-label="Next">
            <NavigateNextIcon />
          </button>
        </div>
      </div>
      
      <div className="restaurants-container" ref={scrollContainerRef}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <div className="restaurant-image">
              <img src={restaurant.image} alt={restaurant.name} loading="lazy" />
              <div className="rating">
                <StarIcon fontSize="small" /> {restaurant.rating}
              </div>
            </div>
            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p className="cuisine">{restaurant.cuisine}</p>
              <p className="location">{restaurant.location}</p>
              <div className="price-distance">
                <span>{restaurant.price}</span>
                <span>{restaurant.distance}</span>
              </div>
              <div className="features">
                {restaurant.features.map((feature, index) => (
                  <span key={index} className="feature">
                    {feature === 'Table booking' ? <EventSeatIcon fontSize="small" /> : <RestaurantIcon fontSize="small" />}
                    {feature}
                  </span>
                ))}
              </div>
              <div className="offers">
                {restaurant.offers.map((offer, index) => (
                  <div key={index} className="offer">
                    <LocalOfferIcon fontSize="small" />
                    <span>{offer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRestaurants;
