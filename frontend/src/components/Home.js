import React from 'react';
import './Home.css';

const Home = ({ connectWallet }) => {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">Welcome to DEXIOS</h1>
        <p className="hero-subtitle">Decentralized AI Services Marketplace</p>
        <p className="hero-description">
          Connect with AI service providers. Pay with crypto. Get your work delivered on IPFS.
        </p>
        <button className="hero-button" onClick={connectWallet}>
          Connect MetaMask to Get Started
        </button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>🎯 Fully Decentralized</h3>
          <p>No middlemen, no servers. Everything on blockchain.</p>
        </div>
        <div className="feature-card">
          <h3>💰 Secure Escrow</h3>
          <p>Smart contracts protect both buyers and sellers.</p>
        </div>
        <div className="feature-card">
          <h3>🏆 NFT Reputation</h3>
          <p>Build your reputation with tamper-proof NFTs.</p>
        </div>
        <div className="feature-card">
          <h3>📁 IPFS Storage</h3>
          <p>Decentralized file delivery with IPFS.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
