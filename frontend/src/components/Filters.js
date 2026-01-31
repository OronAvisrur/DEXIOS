import React from 'react';
import './Filters.css';

const Filters = ({ filters, onFilterChange, onSortChange, sortBy }) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>Price Range (DXIO)</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Max Delivery Time (hours)</label>
        <input
          type="number"
          placeholder="e.g., 48"
          value={filters.maxDeliveryTime}
          onChange={(e) => onFilterChange('maxDeliveryTime', e.target.value)}
          min="1"
        />
      </div>

      <div className="filter-group">
        <label>AI Model</label>
        <input
          type="text"
          placeholder="e.g., GPT-4, DALL-E"
          value={filters.aiModel}
          onChange={(e) => onFilterChange('aiModel', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="cheapest">Lowest Price</option>
          <option value="expensive">Highest Price</option>
          <option value="fastest">Fastest Delivery</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
