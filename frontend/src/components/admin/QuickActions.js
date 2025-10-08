// components/admin/QuickActions.js - Floating quick actions menu
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTimes, FaHome, FaUsers, FaCalendar, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { 
      icon: <FaHome />, 
      label: 'Add House', 
      color: 'from-green-500 to-green-600',
      onClick: () => navigate('/admin/houses')
    },
    { 
      icon: <FaUsers />, 
      label: 'View Users', 
      color: 'from-blue-500 to-blue-600',
      onClick: () => navigate('/admin/users')
    },
    { 
      icon: <FaCalendar />, 
      label: 'Bookings', 
      color: 'from-purple-500 to-purple-600',
      onClick: () => navigate('/admin/bookings')
    },
    { 
      icon: <FaChartBar />, 
      label: 'Analytics', 
      color: 'from-orange-500 to-orange-600',
      onClick: () => navigate('/admin')
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap`}
              >
                <span className="text-xl">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaTimes /> : <FaPlus />}
      </motion.button>
    </div>
  );
};

export default QuickActions;
