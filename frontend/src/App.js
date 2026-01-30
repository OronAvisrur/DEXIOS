import React, { useState } from 'react';
import './App.css';
import useWeb3 from './hooks/useWeb3';
import useContracts from './hooks/useContracts';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Marketplace from './components/Marketplace';
import CreateGig from './components/CreateGig';
import MyGigs from './components/MyGigs';
import MyOrders from './components/MyOrders';

function App() {
  const { web3, account, connectWallet, isConnected } = useWeb3();
  const { marketplace, token, nft, loading } = useContracts(web3);
  const [currentView, setCurrentView] = useState('home');

  const renderView = () => {
    if (!isConnected) {
      return <Home connectWallet={connectWallet} />;
    }

    if (loading) {
      return <div className="loading">Loading contracts...</div>;
    }

    switch (currentView) {
      case 'marketplace':
        return <Marketplace marketplace={marketplace} token={token} account={account} />;
      case 'create-gig':
        return <CreateGig marketplace={marketplace} nft={nft} account={account} setView={setCurrentView} />;
      case 'my-gigs':
        return <MyGigs marketplace={marketplace} account={account} />;
      case 'my-orders':
        return <MyOrders marketplace={marketplace} token={token} account={account} />;
      default:
        return <Home connectWallet={connectWallet} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        account={account} 
        isConnected={isConnected} 
        setView={setCurrentView}
        currentView={currentView}
      />
      <div className="container">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
