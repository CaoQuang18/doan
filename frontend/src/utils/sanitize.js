// utils/sanitize.js - Input sanitization utilities
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Untrusted HTML string
 * @param {object} config - DOMPurify configuration
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (dirty, config = {}) => {
  if (!dirty || typeof dirty !== 'string') return '';
  
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
    ...config
  };
  
  return DOMPurify.sanitize(dirty, defaultConfig);
};

/**
 * Sanitize plain text input (remove HTML tags completely)
 * @param {string} input - User input
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Validate and sanitize email
 * @param {string} email - Email address
 * @returns {string|null} - Sanitized email or null if invalid
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  
  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(sanitized) ? sanitized : null;
};

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param {string} url - URL string
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  const sanitized = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerURL = sanitized.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerURL.startsWith(protocol)) {
      return null;
    }
  }
  
  // Only allow http, https, and relative URLs
  if (sanitized.startsWith('http://') || 
      sanitized.startsWith('https://') || 
      sanitized.startsWith('/')) {
    return sanitized;
  }
  
  return null;
};

/**
 * Sanitize object properties recursively
 * @param {object} obj - Object to sanitize
 * @param {array} textFields - Fields to treat as plain text
 * @param {array} htmlFields - Fields to treat as HTML
 * @returns {object} - Sanitized object
 */
export const sanitizeObject = (obj, textFields = [], htmlFields = []) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      if (textFields.includes(key)) {
        sanitized[key] = sanitizeText(value);
      } else if (htmlFields.includes(key)) {
        sanitized[key] = sanitizeHTML(value);
      } else if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) {
        sanitized[key] = sanitizeURL(value);
      } else {
        // Default: sanitize as text
        sanitized[key] = sanitizeText(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, textFields, htmlFields);
    }
  });
  
  return sanitized;
};

/**
 * Validate and sanitize form data
 * @param {object} formData - Form data object
 * @param {object} rules - Validation rules
 * @returns {object} - { valid: boolean, data: sanitized data, errors: array }
 */
export const validateAndSanitize = (formData, rules = {}) => {
  const errors = [];
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    const rule = rules[key] || {};
    
    // Required check
    if (rule.required && (!value || value.trim() === '')) {
      errors.push(`${key} is required`);
      return;
    }
    
    // Type-specific sanitization
    switch (rule.type) {
      case 'email':
        sanitized[key] = sanitizeEmail(value);
        if (value && !sanitized[key]) {
          errors.push(`${key} is not a valid email`);
        }
        break;
        
      case 'url':
        sanitized[key] = sanitizeURL(value);
        if (value && !sanitized[key]) {
          errors.push(`${key} is not a valid URL`);
        }
        break;
        
      case 'html':
        sanitized[key] = sanitizeHTML(value, rule.config);
        break;
        
      case 'number':
        sanitized[key] = parseFloat(value);
        if (isNaN(sanitized[key])) {
          errors.push(`${key} must be a number`);
        }
        break;
        
      default:
        sanitized[key] = sanitizeText(value);
    }
    
    // Min/Max length check
    if (rule.minLength && sanitized[key]?.length < rule.minLength) {
      errors.push(`${key} must be at least ${rule.minLength} characters`);
    }
    if (rule.maxLength && sanitized[key]?.length > rule.maxLength) {
      errors.push(`${key} must be at most ${rule.maxLength} characters`);
    }
    
    // Custom validation
    if (rule.validate && typeof rule.validate === 'function') {
      const customError = rule.validate(sanitized[key]);
      if (customError) {
        errors.push(customError);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    data: sanitized,
    errors
  };
};

export default {
  sanitizeHTML,
  sanitizeText,
  sanitizeEmail,
  sanitizeURL,
  sanitizeObject,
  validateAndSanitize
};
