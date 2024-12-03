import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryBanner.css';
import deliveryBoyImage from '../../assets/images/delivery-boy (2).png';

const DeliveryBanner = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/signup', { state: { userType: 'delivery' } });
  };

  return (
    <div className="delivery-banner-container">
      <div className="delivery-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h2>Become a Delivery Partner</h2>
            <p>Join our network and earn up to ₹25,000 per month</p>
            <button onClick={handleJoinClick} className="join-button">
              Join Now
            </button>
          </div>
          <div className="banner-image">
            <img src={deliveryBoyImage} alt="Delivery Partner" />
          </div>
        </div>
        <div className="banner-features">
          <div className="feature">
            <div className="feature-icon">🛵</div>
            <div className="feature-text">
              <h4>Flexible Hours</h4>
              <p>Work on your schedule</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <div className="feature-text">
              <h4>Weekly Payments</h4>
              <p>Get paid every week</p>
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">📱</div>
            <div className="feature-text">
              <h4>Easy to Start</h4>
              <p>Quick registration process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBanner;
