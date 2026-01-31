export const validateGigForm = (formData) => {
  const errors = [];

  if (!formData.title || formData.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  }

  if (!formData.description || formData.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters');
  }

  if (!formData.aiModel || formData.aiModel.trim().length < 3) {
    errors.push('AI Model must be at least 3 characters');
  }

  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!formData.deliveryTime || parseInt(formData.deliveryTime) <= 0) {
    errors.push('Delivery time must be greater than 0');
  }

  return errors;
};

export const validateOrderRequirements = (requirements) => {
  if (!requirements || requirements.trim().length < 10) {
    return 'Requirements must be at least 10 characters';
  }
  return null;
};

export const validateRating = (rating) => {
  const num = parseInt(rating);
  if (isNaN(num) || num < 1 || num > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
};

export const validateFile = (file, maxSizeMB = 50) => {
  if (!file) {
    return 'No file selected';
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return null;
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};
