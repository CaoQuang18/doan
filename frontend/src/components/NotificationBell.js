import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaTrash, FaTimes, FaHome, FaHeart, FaUser, FaCalendar } from 'react-icons/fa';
import { useNotifications } from './NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <FaCalendar className="text-blue-500" />;
      case 'favorite':
        return <FaHeart className="text-red-500" />;
      case 'property':
        return <FaHome className="text-green-500" />;
      case 'user':
        return <FaUser className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    try {
      const now = new Date();
      const past = new Date(timestamp);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return past.toLocaleDateString('vi-VN');
    } catch {
      return 'vừa xong';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 hover:bg-white/10 rounded-xl group"
        title="Thông báo"
      >
        <FaBell className="text-2xl text-white group-hover:scale-110" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold 
                     rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-lg"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thông báo</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Tất cả đã đọc'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-2 hover:bg-violet-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        title="Đánh dấu tất cả đã đọc"
                      >
                        <FaCheck className="text-violet-600 dark:text-violet-400" />
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Xóa tất cả"
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <FaBell className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có thông báo</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Thông báo sẽ xuất hiện ở đây
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              !notification.read 
                                ? 'bg-violet-100 dark:bg-violet-900/30' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-semibold text-sm ${
                                !notification.read 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {getTimeAgo(notification.timestamp)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <FaTimes className="text-xs text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      // Navigate to notifications page if exists
                    }}
                    className="w-full text-center text-sm text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
