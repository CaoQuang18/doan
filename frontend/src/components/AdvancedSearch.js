// components/AdvancedSearch.js - Advanced search with multi-select and price slider
import React, { useState, useContext } from 'react';
import { HouseContext } from './HouseContext';
import { FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaHome, FaDollarSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedSearch = () => {
  const { countries, properties, handleAdvancedSearch } = useContext(HouseContext);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    countries: [],
    propertyTypes: [],
    priceRange: [0, 200000],
    bedrooms: '',
    bathrooms: '',
    minSurface: ''
  });

  const bedroomOptions = ['1', '2', '3', '4', '5', '6+'];
  const bathroomOptions = ['1', '2', '3', '4+'];

  const handleCountryToggle = (country) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }));
  };

  const handlePropertyToggle = (property) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(property)
        ? prev.propertyTypes.filter(p => p !== property)
        : [...prev.propertyTypes, property]
    }));
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  const handleSearch = () => {
    handleAdvancedSearch(filters);
    setShowFilters(false);
  };

  const handleReset = () => {
    setFilters({
      countries: [],
      propertyTypes: [],
      priceRange: [0, 200000],
      bedrooms: '',
      bathrooms: '',
      minSurface: ''
    });
    handleAdvancedSearch(null); // Reset to show all
  };

  const activeFiltersCount = 
    filters.countries.length + 
    filters.propertyTypes.length + 
    (filters.bedrooms ? 1 : 0) + 
    (filters.bathrooms ? 1 : 0) + 
    (filters.minSurface ? 1 : 0);

  return (
    <div className="max-w-[1170px] mx-auto px-[30px] relative z-50">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 -mt-8 relative">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <FaFilter />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={handleSearch}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
          >
            <FaSearch />
            <span>Search Properties</span>
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold flex items-center gap-2 transition-all"
            >
              <FaTimes />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Active Filters Chips */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.countries.map(country => (
              <span key={country} className="px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full text-sm flex items-center gap-2">
                <FaMapMarkerAlt size={12} />
                {country}
                <button onClick={() => handleCountryToggle(country)} className="hover:text-violet-900 dark:hover:text-violet-100">
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
            {filters.propertyTypes.map(type => (
              <span key={type} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm flex items-center gap-2">
                <FaHome size={12} />
                {type}
                <button onClick={() => handlePropertyToggle(type)} className="hover:text-green-900 dark:hover:text-green-100">
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
            {filters.bedrooms && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                {filters.bedrooms} Bedrooms
              </span>
            )}
            {filters.bathrooms && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                {filters.bathrooms} Bathrooms
              </span>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 z-50"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Location Multi-select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <FaMapMarkerAlt className="text-violet-500" />
                  Location
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {countries.filter(c => c !== 'Location (any)').map(country => (
                    <label key={country} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.countries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Type Multi-select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <FaHome className="text-violet-500" />
                  Property Type
                </label>
                <div className="space-y-2">
                  {properties.filter(p => p !== 'Property type (any)').map(property => (
                    <label key={property} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(property)}
                        onChange={() => handlePropertyToggle(property)}
                        className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{property}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <FaDollarSign className="text-violet-500" />
                  Price Range
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, e.target.value)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, e.target.value)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">${filters.priceRange[0].toLocaleString()}</span>
                    <span className="font-semibold">${filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                  Bedrooms
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {bedroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters(prev => ({ ...prev, bedrooms: prev.bedrooms === option ? '' : option }))}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filters.bedrooms === option
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
                  Bathrooms
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bathroomOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters(prev => ({ ...prev, bathrooms: prev.bathrooms === option ? '' : option }))}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        filters.bathrooms === option
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSearch}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                Apply Filters
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold transition-all"
              >
                Reset All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
