// utils/api.js - Network utility with retry logic

/**
 * Fetch with automatic retry on failure
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @param {number} retries - Number of retry attempts
 * @returns {Promise} - Response data
 */
export const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // If response is not ok, throw error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      // If this is the last retry, throw the error
      if (i === retries - 1) {
        console.error(`❌ API call failed after ${retries} attempts:`, error);
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = 1000 * Math.pow(2, i); // 1s, 2s, 4s
      console.warn(`⚠️ Retry ${i + 1}/${retries} after ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

/**
 * GET request with retry
 */
export const apiGet = async (endpoint, retries = 3) => {
  return fetchWithRetry(endpoint, { method: 'GET' }, retries);
};

/**
 * POST request with retry
 */
export const apiPost = async (endpoint, data, retries = 3) => {
  return fetchWithRetry(
    endpoint,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    },
    retries
  );
};

/**
 * PUT request with retry
 */
export const apiPut = async (endpoint, data, retries = 3) => {
  return fetchWithRetry(
    endpoint,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    },
    retries
  );
};

/**
 * DELETE request with retry
 */
export const apiDelete = async (endpoint, retries = 3) => {
  return fetchWithRetry(endpoint, { method: 'DELETE' }, retries);
};

export default {
  fetchWithRetry,
  apiGet,
  apiPost,
  apiPut,
  apiDelete
};
