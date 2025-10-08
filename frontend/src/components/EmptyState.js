// components/EmptyState.js - Beautiful empty states
import React from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaHome, FaHeart, FaExclamationCircle } from 'react-icons/fa';

const EmptyState = ({ 
  type = 'search', 
  title, 
  message, 
  suggestions = [],
  actions = [] 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <FaSearch className="text-6xl text-gray-300 dark:text-gray-600" />;
      case 'favorites':
        return <FaHeart className="text-6xl text-gray-300 dark:text-gray-600" />;
      case 'error':
        return <FaExclamationCircle className="text-6xl text-red-300 dark:text-red-600" />;
      default:
        return <FaHome className="text-6xl text-gray-300 dark:text-gray-600" />;
    }
  };

  const defaultTitles = {
    search: 'No properties found',
    favorites: 'No favorites yet',
    error: 'Something went wrong',
    default: 'Nothing here'
  };

  const defaultMessages = {
    search: 'Try adjusting your search filters to find what you\'re looking for',
    favorites: 'Start adding properties to your favorites to see them here',
    error: 'We encountered an error. Please try again later',
    default: 'There\'s nothing to show here at the moment'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        {getIcon()}
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        {title || defaultTitles[type]}
      </h3>

      {/* Message */}
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {message || defaultMessages[type]}
      </p>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-md">
          <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Try:</p>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {actions.map((action, index) => (
            <motion.button
              key={index}
              onClick={action.onClick}
              className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
                action.primary
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
