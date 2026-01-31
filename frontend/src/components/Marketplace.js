import React, { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { fromWei, toWei } from '../utils/web3';
import { validateOrderRequirements, sanitizeInput } from '../utils/validation';
import SearchBar from './SearchBar';
import Filters from './Filters';
import Loading from './Loading';
import './Marketplace.css';

const Marketplace = ({ showToast }) => {
  const { account } = useWeb3();
  const { marketplace, token } = useContracts();
  const [allGigs, setAllGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderingGig, setOrderingGig] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    maxDeliveryTime: '',
    aiModel: ''
  });

  useEffect(() => {
    if (marketplace) {
      loadGigs();
    }
  }, [marketplace]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allGigs, searchTerm, filters, sortBy]);

  const loadGigs = async () => {
    setLoading(true);
    try {
      const gigCount = await marketplace.methods.gigCounter().call();
      const gigs = [];

      for (let i = 1; i <= gigCount; i++) {
        const gig = await marketplace.methods.getGig(i).call();
        if (gig.isActive) {
          gigs.push({ id: i, ...gig });
        }
      }

      setAllGigs(gigs);
      showToast('Gigs loaded successfully', 'success');
    } catch (error) {
      console.error('Error loading gigs:', error);
      showToast('Failed to load gigs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...allGigs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(gig =>
        gig.title.toLowerCase().includes(term) ||
        gig.description.toLowerCase().includes(term) ||
        gig.aiModel.toLowerCase().includes(term)
      );
    }

    if (filters.minPrice) {
      const minPriceWei = toWei(filters.minPrice);
      result = result.filter(gig => BigInt(gig.price) >= BigInt(minPriceWei));
    }

    if (filters.maxPrice) {
      const maxPriceWei = toWei(filters.maxPrice);
      result = result.filter(gig => BigInt(gig.price) <= BigInt(maxPriceWei));
    }

    if (filters.maxDeliveryTime) {
      result = result.filter(gig => parseInt(gig.deliveryTime) <= parseInt(filters.maxDeliveryTime));
    }

    if (filters.aiModel) {
      const model = filters.aiModel.toLowerCase();
      result = result.filter(gig => gig.aiModel.toLowerCase().includes(model));
    }

    if (sortBy === 'newest') {
      result.reverse();
    } else if (sortBy === 'cheapest') {
      result.sort((a, b) => BigInt(a.price) > BigInt(b.price) ? 1 : -1);
    } else if (sortBy === 'expensive') {
      result.sort((a, b) => BigInt(a.price) < BigInt(b.price) ? 1 : -1);
    } else if (sortBy === 'fastest') {
      result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    }

    setFilteredGigs(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <Filters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {filteredGigs.length === 0 ? (
        <div className="no-gigs">
          {searchTerm || Object.values(filters).some(v => v) 
            ? 'No gigs match your filters' 
            : 'No active gigs available'}
        </div>
      ) : (
        <div className="gigs-grid">
          {filteredGigs.map((gig) => (
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
