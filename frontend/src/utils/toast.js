/**
 * Toast helper utility
 * Provides consistent toast/alert messaging across the app
 */

export const showToast = (toast, message, type = 'info') => {
  if (toast && typeof toast[type] === 'function') {
    toast[type](message);
  } else {
    // Fallback to alert if toast not available
    alert(message);
  }
};

export const toastHelpers = (toast) => ({
  success: (message) => showToast(toast, message, 'success'),
  error: (message) => showToast(toast, message, 'error'),
  warning: (message) => showToast(toast, message, 'warning'),
  info: (message) => showToast(toast, message, 'info'),
});

export default showToast;
