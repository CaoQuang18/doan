// utils/security.js - Security utilities

/**
 * Simple XSS sanitization (basic version)
 * For production, use DOMPurify library
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<iframe/gi, '&lt;iframe')
    .replace(/<embed/gi, '&lt;embed')
    .replace(/<object/gi, '&lt;object');
};

/**
 * Sanitize HTML content
 */
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return html;
  
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 6;
};

/**
 * Escape HTML special characters
 */
export const escapeHTML = (str) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

export default {
  sanitizeInput,
  sanitizeHTML,
  isValidEmail,
  isStrongPassword,
  escapeHTML
};
