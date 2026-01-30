import React, { useState } from 'react';
import './App.css';
import useWeb3 from './hooks/useWeb3';
import useContracts from './hooks/useContracts';

function App() {
  const { web3, account, connectWallet, isConnected } = useWeb3();
  const { marketplace, token, nft, loading } = useContracts(web3);
  const [currentView, setCurrentView] = useState('home');

  if (!isConnected) {
    return (
      <div className="App">
        <div className="loading">
          <button onClick={connectWallet}>Connect MetaMask</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading contracts...</div>;
  }

  return (
    <div className="App">
      <div className="container">
        <h1>DEXIOS Marketplace</h1>
        <p>Account: {account}</p>
      </div>
    </div>
  );
}

export default App;
