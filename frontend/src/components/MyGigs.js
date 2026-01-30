import React, { useState, useEffect } from 'react';
import './MyGigs.css';
import { fromWei } from '../utils/web3';

const MyGigs = ({ marketplace, account }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyGigs();
  }, [marketplace, account]);

  const loadMyGigs = async () => {
    if (!marketplace || !account) return;

    try {
      const gigIds = await marketplace.methods.getSellerGigs(account).call();
      const loadedGigs = [];

      for (let id of gigIds) {
        const gig = await marketplace.methods.getGig(id).call();
        loadedGigs.push(gig);
      }

      setGigs(loadedGigs);
    } catch (error) {
      console.error('Error loading gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGigStatus = async (gigId, currentStatus) => {
    try {
      await marketplace.methods.updateGigStatus(gigId, !currentStatus).send({ from: account });
      alert('Gig status updated!');
      loadMyGigs();
    } catch (error) {
      console.error('Error updating gig:', error);
      alert('Failed to update gig');
    }
  };

  if (loading) {
    return <div className="loading">Loading your gigs...</div>;
  }

  return (
    <div className="my-gigs">
      <h2>My Gigs</h2>

      {gigs.length === 0 ? (
        <p className="no-gigs">You haven't created any gigs yet.</p>
      ) : (
        <div className="gigs-list">
          {gigs.map((gig) => (
            <div key={gig.id} className="gig-item">
              <div className="gig-header">
                <h3>{gig.title}</h3>
                <span className={`gig-status ${gig.isActive ? 'active' : 'inactive'}`}>
                  {gig.isActive ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
              <p>{gig.description}</p>
              <div className="gig-details">
                <span>💰 {fromWei(gig.priceInTokens)} DXIO</span>
                <span>⏱️ {gig.deliveryTimeHours}h</span>
                <span>📦 {gig.ordersCompleted} orders</span>
                <span>⭐ {gig.ratingCount > 0 ? (Number(gig.totalRating) / Number(gig.ratingCount)).toFixed(1) : 'N/A'}</span>
              </div>
              <button onClick={() => toggleGigStatus(gig.id, gig.isActive)}>
                {gig.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
