import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';

const Header = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className="head">
      <div className="linker">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>

      <div className="sign">
        {user ? (
          <>
            <span style={{ marginRight: '10px', color: 'white' }}>
              Welcome, {user.firstName || user.username || 'User'}
            </span>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <button onClick={openSignIn} className="auth-btn">
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
