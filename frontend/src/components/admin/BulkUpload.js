// components/admin/BulkUpload.js - CSV bulk upload for houses
import React, { useState } from 'react';
import { FaUpload, FaDownload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useToast } from '../Toast';

export const BulkUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }
    
    return data;
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning('Please select a file first');
      return;
    }

    setUploading(true);
    
    try {
      // Read CSV file
      const text = await file.text();
      const houses = parseCSV(text);

      console.log('Parsed houses:', houses);

      // Validate data
      const errors = [];
      const validHouses = houses.filter((house, index) => {
        if (!house.name || !house.type || !house.price) {
          errors.push(`Row ${index + 2}: Missing required fields (name, type, price)`);
          return false;
        }
        return true;
      });

      if (errors.length > 0) {
        setResults({
          success: false,
          total: houses.length,
          valid: validHouses.length,
          errors
        });
        toast.warning(`${errors.length} rows have errors`);
        setUploading(false);
        return;
      }

      // Upload to backend
      const response = await fetch('http://localhost:5000/api/houses/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ houses: validHouses })
      });

      const data = await response.json();

      if (response.ok) {
        setResults({
          success: true,
          total: houses.length,
          created: data.created || validHouses.length,
          errors: []
        });
        toast.success(`Successfully uploaded ${validHouses.length} houses!`);
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload CSV');
      setResults({
        success: false,
        errors: [error.message]
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,type,description,image,imageLg,country,address,bedrooms,bathrooms,surface,year,price,status
Luxury Villa,House,Beautiful luxury villa,/assets/img/houses/house1.png,/assets/img/houses/house1lg.png,United States,123 Main St,4,3,3500 sq ft,2020,150000,Trả phòng
Modern Apartment,Apartment,Modern apartment in city center,/assets/img/apartments/a1.png,/assets/img/apartments/a1lg.png,Canada,456 Oak Ave,2,2,1200 sq ft,2021,80000,Trả phòng`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'houses_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Bulk Upload Houses (CSV)
      </h3>

      {/* Download Template */}
      <button
        onClick={downloadTemplate}
        className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
      >
        <FaDownload />
        Download CSV Template
      </button>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          <FaUpload className="text-4xl text-violet-500" />
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {file ? file.name : 'Click to select CSV file'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or drag and drop
            </p>
          </div>
        </label>
      </div>

      {/* Upload Button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <FaUpload />
              Upload Houses
            </>
          )}
        </button>
      )}

      {/* Results */}
      {results && (
        <div className={`mt-6 p-4 rounded-lg ${
          results.success 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start gap-3">
            {results.success ? (
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl flex-shrink-0 mt-1" />
            ) : (
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl flex-shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${
                results.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
              }`}>
                {results.success ? 'Upload Successful!' : 'Upload Failed'}
              </h4>
              <div className="text-sm space-y-1">
                {results.total && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Total rows: <span className="font-semibold">{results.total}</span>
                  </p>
                )}
                {results.valid !== undefined && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Valid rows: <span className="font-semibold">{results.valid}</span>
                  </p>
                )}
                {results.created && (
                  <p className="text-green-700 dark:text-green-300">
                    Created: <span className="font-semibold">{results.created}</span>
                  </p>
                )}
                {results.errors && results.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-700 dark:text-red-300 font-semibold">Errors:</p>
                    <ul className="list-disc list-inside text-red-600 dark:text-red-400 mt-1">
                      {results.errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-xs">{error}</li>
                      ))}
                      {results.errors.length > 5 && (
                        <li className="text-xs">... and {results.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
