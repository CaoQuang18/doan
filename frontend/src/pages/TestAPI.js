// Test page to debug API
import React, { useState, useEffect } from 'react';

const TestAPI = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testFetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing fetch to: http://localhost:5000/api/houses');
      
      const response = await fetch('http://localhost:5000/api/houses');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const json = await response.json();
      console.log('Received JSON:', json);
      console.log('Number of houses:', json.length);
      
      setData(json);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testFetch();
  }, []);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">API Test Page</h1>
      
      <button 
        onClick={testFetch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        Reload Data
      </button>

      {loading && <p className="text-gray-600 dark:text-gray-400">Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Success!</strong> Loaded {data.length} houses
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Houses Data:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-96 text-sm text-gray-900 dark:text-gray-100">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAPI;
