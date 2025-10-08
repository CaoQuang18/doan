// utils/imageHelper.js - Helper functions for image URLs

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Convert relative image path to full URL
 * @param {string} imagePath - Image path from backend
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /, prepend base URL
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Otherwise, assume it's a relative path
  return `${API_BASE_URL}/${imagePath}`;
};

/**
 * Process house data to fix image URLs
 * @param {object} house - House object from backend
 * @returns {object} - House with fixed image URLs
 */
export const processHouseImages = (house) => {
  if (!house) return house;
  
  return {
    ...house,
    image: getImageUrl(house.image),
    imageLg: getImageUrl(house.imageLg),
    agent: house.agent ? {
      ...house.agent,
      image: getImageUrl(house.agent.image)
    } : house.agent
  };
};

/**
 * Process array of houses to fix image URLs
 * @param {array} houses - Array of house objects
 * @returns {array} - Houses with fixed image URLs
 */
export const processHousesImages = (houses) => {
  if (!Array.isArray(houses)) return [];
  return houses.map(processHouseImages);
};

export default {
  getImageUrl,
  processHouseImages,
  processHousesImages
};
