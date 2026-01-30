import React, { useState } from 'react';
import './CreateGig.css';
import { toWei } from '../utils/web3';

const CreateGig = ({ marketplace, nft, account, setView }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    aiModel: '',
    price: '',
    deliveryTime: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hasProfile = await nft.methods.hasProfile(account).call();
      
      if (!hasProfile) {
        alert('Creating seller profile first...');
        await nft.methods.mintProfile(account).send({ from: account });
      }

      await marketplace.methods.createGig(
        formData.title,
        formData.description,
        formData.aiModel,
        toWei(formData.price),
        formData.deliveryTime
      ).send({ from: account });

      alert('Gig created successfully!');
      setView('my-gigs');
    } catch (error) {
      console.error('Error creating gig:', error);
      alert('Failed to create gig: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-gig">
      <h2>Create New Gig</h2>
      
      <form onSubmit={handleSubmit} className="gig-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., AI Logo Design with DALL-E 3"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your service in detail..."
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>AI Model</label>
            <input
              type="text"
              name="aiModel"
              value={formData.aiModel}
              onChange={handleChange}
              placeholder="e.g., GPT-4, DALL-E 3"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (DXIO)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="50"
              min="1"
              step="0.01"
              required
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
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Creating...' : 'Create Gig'}
        </button>
      </form>
    </div>
  );
};

export default CreateGig;
