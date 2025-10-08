// hooks/useApiCall.js - Enhanced API call hook with retry logic
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for API calls with loading, error handling, and retry logic
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, retry, cancel }
 */
export const useApiCall = (apiFunction, options = {}) => {
  const {
    immediate = false,
    retries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Cancel any pending requests on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (...args) => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    let currentRetry = 0;

    const attemptCall = async () => {
      try {
        const result = await apiFunction(...args);
        
        if (!isMountedRef.current) return;

        setData(result);
        setError(null);
        setRetryCount(0);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        if (!isMountedRef.current) return;

        // Don't retry if request was cancelled
        if (err.name === 'AbortError' || err.message?.includes('abort')) {
          return;
        }

        // Retry logic
        if (currentRetry < retries) {
          currentRetry++;
          setRetryCount(currentRetry);
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Retry attempt ${currentRetry}/${retries}`);
          }

          // Wait before retrying with exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * Math.pow(2, currentRetry - 1))
          );

          return attemptCall();
        }

        // All retries failed
        setError(err.message || 'An error occurred');
        
        if (onError) {
          onError(err);
        }
        
        throw err;
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    return attemptCall();
  }, [apiFunction, retries, retryDelay, onSuccess, onError]);

  const retry = useCallback(() => {
    setRetryCount(0);
    return execute();
  }, [execute]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setRetryCount(0);
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]); // Only run on mount

  return {
    data,
    loading,
    error,
    retryCount,
    execute,
    retry,
    cancel,
    reset,
  };
};

/**
 * Hook for multiple API calls in parallel
 * @param {Array} apiCalls - Array of API functions
 * @returns {Object} - { data, loading, error, execute }
 */
export const useParallelApiCalls = (apiCalls = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        apiCalls.map(apiCall => apiCall())
      );
      
      setData(results);
      return results;
    } catch (err) {
      setError(err.message || 'One or more requests failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCalls]);

  return { data, loading, error, execute };
};

/**
 * Hook for sequential API calls
 * @param {Array} apiCalls - Array of API functions
 * @returns {Object} - { data, loading, error, execute }
 */
export const useSequentialApiCalls = (apiCalls = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentIndex(0);

    const results = [];

    try {
      for (let i = 0; i < apiCalls.length; i++) {
        setCurrentIndex(i);
        const result = await apiCalls[i]();
        results.push(result);
      }
      
      setData(results);
      return results;
    } catch (err) {
      setError(err.message || 'Request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCalls]);

  return { 
    data, 
    loading, 
    error, 
    currentIndex, 
    progress: apiCalls.length > 0 ? (currentIndex / apiCalls.length) * 100 : 0,
    execute 
  };
};

export default useApiCall;
