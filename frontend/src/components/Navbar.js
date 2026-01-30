import React from 'react';
import './Navbar.css';
import { shortenAddress } from '../utils/web3';

const Navbar = ({ account, isConnected, setView, currentView }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo" onClick={() => setView('home')}>DEXIOS</h1>
        
        {isConnected && (
          <div className="navbar-menu">
            <button 
              className={currentView === 'marketplace' ? 'active' : ''}
              onClick={() => setView('marketplace')}
            >
              Marketplace
            </button>
            <button 
              className={currentView === 'create-gig' ? 'active' : ''}
              onClick={() => setView('create-gig')}
            >
              Create Gig
            </button>
            <button 
              className={currentView === 'my-gigs' ? 'active' : ''}
              onClick={() => setView('my-gigs')}
            >
              My Gigs
            </button>
            <button 
              className={currentView === 'my-orders' ? 'active' : ''}
              onClick={() => setView('my-orders')}
            >
              My Orders
            </button>
          </div>
        )}
        
        {isConnected && (
          <div className="navbar-account">
            {shortenAddress(account)}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
