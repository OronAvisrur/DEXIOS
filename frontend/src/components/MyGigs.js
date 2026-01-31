import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { fromWei } from '../utils/web3';
import Loading from './Loading';
import './MyGigs.css';

const MyGigs = ({ showToast }) => {
  const { account } = useWeb3();
  const { marketplace } = useContracts();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (marketplace && account) {
      loadMyGigs();
    }
  }, [marketplace, account]);

  const loadMyGigs = async () => {
    setLoading(true);
    try {
      const gigCount = await marketplace.methods.gigCounter().call();
      const myGigs = [];

      for (let i = 1; i <= gigCount; i++) {
        const gig = await marketplace.methods.getGig(i).call();
        if (gig.seller.toLowerCase() === account.toLowerCase()) {
          myGigs.push({ id: i, ...gig });
        }
      }

      setGigs(myGigs);
      showToast('Your gigs loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading gigs:', error);
      showToast('Failed to load your gigs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (gigId, currentStatus) => {
    try {
      showToast('Updating gig status...', 'info');
      await marketplace.methods.toggleGigStatus(gigId).send({ from: account });
      showToast(`Gig ${currentStatus ? 'deactivated' : 'activated'} successfully`, 'success');
      loadMyGigs();
    } catch (error) {
      console.error('Toggle error:', error);
      showToast('Failed to update gig status', 'error');
    }
  };

  if (loading) return <Loading message="Loading your gigs..." />;

  return (
    <div className="my-gigs">
      <h1>My Gigs</h1>
      
      {gigs.length === 0 ? (
        <div className="no-gigs">
          <p>You haven't created any gigs yet</p>
          <a href="/create-gig" className="create-link">Create Your First Gig</a>
        </div>
      ) : (
        <div className="gigs-list">
          {gigs.map((gig) => (
            <div key={gig.id} className="gig-card">
              <div className="gig-header">
                <h3>{gig.title}</h3>
                <span className={`status ${gig.isActive ? 'active' : 'inactive'}`}>
                  {gig.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="gig-description">{gig.description}</p>
              
              <div className="gig-details">
                <div className="detail-row">
                  <span className="label">AI Model:</span>
                  <span className="value">{gig.aiModel}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Price:</span>
                  <span className="value">{fromWei(gig.price)} DXIO</span>
                </div>
                <div className="detail-row">
                  <span className="label">Delivery Time:</span>
                  <span className="value">{gig.deliveryTime} hours</span>
                </div>
              </div>

              <button 
                onClick={() => handleToggleActive(gig.id, gig.isActive)}
                className={`toggle-btn ${gig.isActive ? 'deactivate' : 'activate'}`}
              >
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
