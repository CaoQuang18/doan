// utils/errorLogger.js - Centralized error logging
/**
 * Error severity levels
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories
 */
export const ErrorCategory = {
  API: 'api',
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  NETWORK: 'network',
  RUNTIME: 'runtime',
  UI: 'ui'
};

/**
 * Log error to console (development) or monitoring service (production)
 * @param {Error|string} error - Error object or message
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const errorInfo = {
    message: error?.message || error,
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...context
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🔴 Error Log');
    console.error('Message:', errorInfo.message);
    console.error('Context:', context);
    if (errorInfo.stack) {
      console.error('Stack:', errorInfo.stack);
    }
    console.groupEnd();
  }

  // In production, send to monitoring service (e.g., Sentry, LogRocket)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error monitoring service
    // Example: Sentry.captureException(error, { extra: context });
  }

  // Store in localStorage for debugging (keep last 10 errors)
  try {
    const errors = JSON.parse(localStorage.getItem('errorLog') || '[]');
    errors.unshift(errorInfo);
    localStorage.setItem('errorLog', JSON.stringify(errors.slice(0, 10)));
  } catch (e) {
    // Ignore localStorage errors
  }
};

/**
 * Log API error with specific context
 * @param {Error} error - Error object
 * @param {Object} requestInfo - Request information
 */
export const logApiError = (error, requestInfo = {}) => {
  logError(error, {
    category: ErrorCategory.API,
    severity: ErrorSeverity.MEDIUM,
    ...requestInfo
  });
};

/**
 * Log validation error
 * @param {string} message - Error message
 * @param {Object} fieldInfo - Field information
 */
export const logValidationError = (message, fieldInfo = {}) => {
  logError(message, {
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    ...fieldInfo
  });
};

/**
 * Log authentication error
 * @param {Error} error - Error object
 */
export const logAuthError = (error) => {
  logError(error, {
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.HIGH
  });
};

/**
 * Log network error
 * @param {Error} error - Error object
 */
export const logNetworkError = (error) => {
  logError(error, {
    category: ErrorCategory.NETWORK,
    severity: ErrorSeverity.MEDIUM
  });
};

/**
 * Get error logs from localStorage
 * @returns {Array} - Array of error logs
 */
export const getErrorLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('errorLog') || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Clear error logs
 */
export const clearErrorLogs = () => {
  try {
    localStorage.removeItem('errorLog');
  } catch (e) {
    // Ignore
  }
};

/**
 * Create user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} - User-friendly message
 */
export const getUserFriendlyMessage = (error) => {
  const message = error?.message || error;

  // Network errors
  if (message.includes('Network') || message.includes('fetch')) {
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.';
  }

  // Timeout errors
  if (message.includes('timeout')) {
    return 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.';
  }

  // Authentication errors
  if (message.includes('401') || message.includes('Unauthorized')) {
    return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
  }

  // Permission errors
  if (message.includes('403') || message.includes('Forbidden')) {
    return 'Bạn không có quyền thực hiện thao tác này.';
  }

  // Not found errors
  if (message.includes('404') || message.includes('Not found')) {
    return 'Không tìm thấy dữ liệu yêu cầu.';
  }

  // Server errors
  if (message.includes('500') || message.includes('Server error')) {
    return 'Lỗi máy chủ. Vui lòng thử lại sau.';
  }

  // Validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
  }

  // Default message
  return 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
};

export default {
  logError,
  logApiError,
  logValidationError,
  logAuthError,
  logNetworkError,
  getErrorLogs,
  clearErrorLogs,
  getUserFriendlyMessage,
  ErrorSeverity,
  ErrorCategory
};
