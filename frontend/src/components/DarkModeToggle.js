import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useDarkMode } from './DarkModeContext';

const DarkModeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleDarkMode, isTransitioning } = useDarkMode();

  const handleClick = (e) => {
    if (!isTransitioning) {
      toggleDarkMode(e);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isTransitioning}
      className={`relative p-3 rounded-xl overflow-hidden group ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: isDarkMode
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
        animate={{
          background: isDarkMode
            ? 'radial-gradient(circle at center, rgba(251, 191, 36, 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center w-6 h-6">
        <AnimatePresence mode="wait">
          {isDarkMode ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FaSun className="text-2xl text-yellow-300" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FaMoon className="text-2xl text-slate-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple effect on click */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)'
          }}
        />
      )}
    </motion.button>
  );
};

export default DarkModeToggle;
