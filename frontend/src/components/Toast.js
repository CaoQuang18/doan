import React, { createContext, useContext, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    console.warn('useToast must be used within ToastProvider');
    return {
      toast: {
        success: () => {},
        error: () => {},
        info: () => {},
        warning: () => {}
      },
      addToast: () => {},
      removeToast: () => {}
    };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration || 4000),
    error: (message, duration) => addToast(message, 'error', duration || 5000),
    info: (message, duration) => addToast(message, 'info', duration || 4000),
    warning: (message, duration) => addToast(message, 'warning', duration || 4000),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 max-h-screen overflow-hidden">
        {toasts.map(({ id, message, type }) => (
          <Toast
            key={id}
            id={id}
            message={message}
            type={type}
            onClose={() => removeToast(id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const Toast = ({ id, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getToastStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg shadow-lg transform";

    const typeStyles = {
      success: "bg-green-500 text-white dark:bg-green-600",
      error: "bg-red-500 text-white dark:bg-red-600",
      info: "bg-blue-500 text-white dark:bg-blue-600",
      warning: "bg-yellow-500 text-white dark:bg-yellow-600"
    };

    const visibilityStyles = isVisible
      ? "opacity-100 translate-x-0 scale-100"
      : "opacity-0 translate-x-full scale-95";

    return `${baseStyles} ${typeStyles[type]} ${visibilityStyles}`;
  };

  const getIcon = () => {
    const icons = {
      success: <FaCheckCircle size={20} />,
      error: <FaExclamationCircle size={20} />,
      info: <FaInfoCircle size={20} />,
      warning: <FaExclamationCircle size={20} />
    };

    return (
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>
    );
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}

      <div className="flex-1">
        <p className="font-medium text-sm leading-relaxed">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-75 transition-opacity focus:outline-none p-1"
        aria-label="Đóng thông báo"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

// Add animation styles
if (typeof document !== 'undefined') {
  const styleId = 'toast-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideInFromRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
