import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/images/logo.svg';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Ur Dhaba Logo" className="logo" />
          <span className="brand-name">Ur Dhaba</span>
        </Link>
      </div>
      
      <div className="navbar-right">
        <Link to="/corporate" className="nav-link">Corporate</Link>
        <Link to="/partner" className="nav-link">Partner with us</Link>
        <Link to="/delivery" className="nav-link">Deliver with us</Link>
        <button className="get-app-btn">Get the App</button>
        <button className="sign-in-btn">Sign in</button>
      </div>
    </nav>
  );
};

export default Navbar;
