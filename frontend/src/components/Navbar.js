import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import './Navbar.css';

const Navbar = () => {
  const { account, connectWallet } = useWeb3();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DEXIOS
        </Link>

        <div className="navbar-menu">
          <Link to="/marketplace" className={`navbar-link ${location.pathname === '/marketplace' ? 'active' : ''}`}>
            Marketplace
          </Link>
          <Link to="/create-gig" className={`navbar-link ${location.pathname === '/create-gig' ? 'active' : ''}`}>
            Create Gig
          </Link>
          <Link to="/my-gigs" className={`navbar-link ${location.pathname === '/my-gigs' ? 'active' : ''}`}>
            My Gigs
          </Link>
          <Link to="/my-orders" className={`navbar-link ${location.pathname === '/my-orders' ? 'active' : ''}`}>
            My Orders
          </Link>
          <Link to="/analytics" className={`navbar-link ${location.pathname === '/analytics' ? 'active' : ''}`}>
            Analytics
          </Link>
          <Link to="/dashboard" className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            Dashboard
          </Link>

          {account ? (
            <div className="navbar-account">
              {account.slice(0, 6)}...{account.slice(-4)}
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