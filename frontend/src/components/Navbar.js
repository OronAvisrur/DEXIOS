import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import './Navbar.css';

const Navbar = () => {
  const { account, connectWallet } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DEXIOS
        </Link>

        <button 
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/marketplace" className="navbar-link">
            Marketplace
          </Link>
          <Link to="/create-gig" className="navbar-link">
            Create Gig
          </Link>
          <Link to="/my-gigs" className="navbar-link">
            My Gigs
          </Link>
          <Link to="/my-orders" className="navbar-link">
            My Orders
          </Link>
          <Link to="/analytics" className="navbar-link">
            Analytics
          </Link>
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>

          {account ? (
            <div className="navbar-account">
              {account.substring(0, 6)}...{account.substring(38)}
            </div>
          ) : (
            <button onClick={connectWallet} className="navbar-connect">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
