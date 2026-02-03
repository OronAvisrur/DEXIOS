import React, { useState } from 'react';
import { useContracts } from '../hooks/useContracts';
import { useWeb3 } from '../hooks/useWeb3';
import { toWei } from '../utils/web3';
import { validateGigForm, sanitizeInput } from '../utils/validation';
import Loading from './Loading';
import './CreateGig.css';

const CreateGig = ({ showToast }) => {
  const { account } = useWeb3();
  const { marketplace, sellerNFT } = useContracts();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aiModel: '',
    price: '',
    deliveryTime: ''
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: sanitizeInput(e.target.value)
    });
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateGigForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      validationErrors.forEach(error => showToast(error, 'error'));
      return;
    }

    setLoading(true);
    try {
      const hasProfile = await sellerNFT.methods.hasProfile(account).call();
      
      if (!hasProfile) {
        showToast('Minting seller profile...', 'info');
        await sellerNFT.methods.mintProfile().send({ from: account });
        showToast('Profile created!', 'success');
      }

      showToast('Creating gig...', 'info');
      const priceInWei = toWei(formData.price);
      
      await marketplace.methods.createGig(
        formData.title,
        formData.description,
        formData.aiModel,
        priceInWei,
        parseInt(formData.deliveryTime)
      ).send({ from: account });

      showToast('Gig created successfully!', 'success');
      setFormData({
        title: '',
        description: '',
        aiModel: '',
        price: '',
        deliveryTime: ''
      });
      setErrors([]);
    } catch (error) {
      console.error('Create gig error:', error);
      showToast(error.message.includes('denied') ? 'Transaction cancelled' : 'Failed to create gig', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Creating your gig..." />;

  return (
    <div className="create-gig">
      <h1>Create New Gig</h1>
      <form onSubmit={handleSubmit} className="gig-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., AI Logo Design with DALL-E 3"
            maxLength="100"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your service..."
            rows="5"
            maxLength="500"
          />
        </div>

        <div className="form-group">
          <label>AI Model</label>
          <input
            type="text"
            name="aiModel"
            value={formData.aiModel}
            onChange={handleChange}
            placeholder="e.g., GPT-4, DALL-E 3, Midjourney"
            maxLength="50"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price (DXIO)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="50"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Delivery Time (hours)</label>
            <input
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              placeholder="24"
              min="1"
            />
          </div>
        </div>

        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-text">{error}</p>
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Create Gig
        </button>
      </form>
    </div>
  );
};

export default CreateGig;