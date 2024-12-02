import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import logo from '../../assets/images/logo.svg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Ur Dhaba Logo" />
            <span>Ur Dhaba</span>
          </div>
          <p> 2024 Ur Dhaba Limited</p>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/corporate">Ur Dhaba Corporate</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/team">Team</Link>
          <Link to="/premium">Ur Dhaba Premium</Link>
          <Link to="/instamart">Ur Dhaba Instamart</Link>
          <Link to="/dineout">Ur Dhaba Dineout</Link>
        </div>

        <div className="footer-section">
          <h3>Contact us</h3>
          <Link to="/support">Help & Support</Link>
          <Link to="/partner">Partner With Us</Link>
          <Link to="/ride">Ride With Us</Link>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/cookie-policy">Cookie Policy</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <h3>Available in</h3>
          <div className="cities-grid">
            <Link to="/delhi">Delhi</Link>
            <Link to="/mumbai">Mumbai</Link>
            <Link to="/bangalore">Bangalore</Link>
            <Link to="/hyderabad">Hyderabad</Link>
            <Link to="/pune">Pune</Link>
            <button className="more-cities">685 cities</button>
          </div>
        </div>

        <div className="footer-section">
          <h3>Social Links</h3>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <LinkedInIcon sx={{ fontSize: 24 }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <InstagramIcon sx={{ fontSize: 24 }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FacebookIcon sx={{ fontSize: 24 }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <PinterestIcon sx={{ fontSize: 24 }} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <TwitterIcon sx={{ fontSize: 24 }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
