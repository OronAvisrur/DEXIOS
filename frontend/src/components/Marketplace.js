import React, { useState, useEffect } from 'react';
import './Marketplace.css';
import { fromWei } from '../utils/web3';

const Marketplace = ({ marketplace, token, account }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGigs();
  }, [marketplace]);

  const loadGigs = async () => {
    if (!marketplace) return;
    
    try {
      let gigId = 1;
      const loadedGigs = [];
      
      while (true) {
        try {
          const gig = await marketplace.methods.getGig(gigId).call();
          if (gig.isActive) {
            loadedGigs.push(gig);
          }
          gigId++;
        } catch (error) {
          break;
        }
      }
      
      setGigs(loadedGigs);
    } catch (error) {
      console.error('Error loading gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (gigId, price) => {
    try {
      const requirements = prompt('Enter your requirements:');
      if (!requirements) return;

      setLoading(true);
      await token.methods.approve(marketplace.options.address, price).send({ from: account });
      await marketplace.methods.placeOrder(gigId, requirements).send({ from: account });
      
      alert('Order placed successfully!');
      loadGigs();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading marketplace...</div>;
  }

  return (
    <div className="marketplace">
      <h2>Browse Gigs</h2>
      
      {gigs.length === 0 ? (
        <p className="no-gigs">No gigs available yet. Be the first to create one!</p>
      ) : (
        <div className="gigs-grid">
          {gigs.map((gig) => (
            <div key={gig.id} className="gig-card">
              <h3>{gig.title}</h3>
              <p className="gig-description">{gig.description}</p>
              <div className="gig-meta">
                <span className="gig-model">🤖 {gig.aiModel}</span>
                <span className="gig-delivery">⏱️ {gig.deliveryTimeHours}h</span>
              </div>
              <div className="gig-stats">
                <span>📦 {gig.ordersCompleted} orders</span>
                <span>⭐ {gig.ratingCount > 0 ? (Number(gig.totalRating) / Number(gig.ratingCount)).toFixed(1) : 'N/A'}</span>
              </div>
              <div className="gig-footer">
                <span className="gig-price">{fromWei(gig.priceInTokens)} DXIO</span>
                <button onClick={() => placeOrder(gig.id, gig.priceInTokens)}>
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
