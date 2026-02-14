import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className="head">
      <div className="linker">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="sign">
        <button
          className="auth-btn"
          onClick={() => alert("Authentication removed for deployment demo")}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Header;
