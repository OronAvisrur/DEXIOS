import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { fromWei, toWei } from '../utils/web3';
import { validateOrderRequirements, sanitizeInput } from '../utils/validation';
import Loading from './Loading';
import './Marketplace.css';

const Marketplace = ({ showToast }) => {
  const { account } = useWeb3();
  const { marketplace, token } = useContracts();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderingGig, setOrderingGig] = useState(null);
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    if (marketplace) {
      loadGigs();
    }
  }, [marketplace]);

  const loadGigs = async () => {
    setLoading(true);
    try {
      const gigCount = await marketplace.methods.gigCounter().call();
      const allGigs = [];

      for (let i = 1; i <= gigCount; i++) {
        const gig = await marketplace.methods.getGig(i).call();
        if (gig.isActive) {
          allGigs.push({ id: i, ...gig });
        }
      }

      setGigs(allGigs);
      showToast('Gigs loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading gigs:', error);
      showToast('Failed to load gigs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (gigId, price) => {
    const validationError = validateOrderRequirements(requirements);
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    setOrderingGig(gigId);
    try {
      const allowance = await token.methods.allowance(account, marketplace._address).call();
      if (BigInt(allowance) < BigInt(price)) {
        showToast('Approving tokens...', 'info');
        await token.methods.approve(marketplace._address, price).send({ from: account });
      }

      showToast('Placing order...', 'info');
      const sanitizedRequirements = sanitizeInput(requirements);
      await marketplace.methods.placeOrder(gigId, sanitizedRequirements).send({ from: account });
      showToast('Order placed successfully!', 'success');
      setRequirements('');
      setOrderingGig(null);
    } catch (error) {
      console.error('Order error:', error);
      showToast('Failed to place order: ' + error.message, 'error');
      setOrderingGig(null);
    }
  };

  if (loading) return <Loading message="Loading marketplace..." />;

  return (
    <div className="marketplace">
      <h1>AI Services Marketplace</h1>
      
      {gigs.length === 0 ? (
        <div className="no-gigs">No active gigs available</div>
      ) : (
        <div className="gigs-grid">
          {gigs.map((gig) => (
            <div key={gig.id} className="gig-card">
              <h3>{gig.title}</h3>
              <p className="gig-description">{gig.description}</p>
              <div className="gig-meta">
                <span className="gig-model">🤖 {gig.aiModel}</span>
                <span className="gig-delivery">⏱️ {gig.deliveryTime}h</span>
              </div>
              <div className="gig-price">{fromWei(gig.price)} DXIO</div>
              
              {orderingGig === gig.id ? (
                <div className="order-form">
                  <textarea
                    placeholder="Enter your requirements (minimum 10 characters)..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows="4"
                    maxLength="500"
                  />
                  <div className="char-count">
                    {requirements.length}/500
                  </div>
                  <button 
                    onClick={() => handlePlaceOrder(gig.id, gig.price)}
                    className="order-btn"
                    disabled={requirements.length < 10}
                  >
                    Confirm Order
                  </button>
                  <button 
                    onClick={() => {
                      setOrderingGig(null);
                      setRequirements('');
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setOrderingGig(gig.id)}
                  className="order-btn"
                >
                  Order Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
