/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Safely formats a date value to a localized date string
 * @param {string|Date|number} dateValue - The date value to format
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or error message
 */
export const formatDate = (dateValue, locale = 'en-US', options = {}) => {
  try {
    if (!dateValue) return 'N/A';
    
    // If it's already a Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString(locale, options);
    }
    
    // If it's a string or number, convert to Date
    const date = new Date(dateValue);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Safely formats a date value to a localized date and time string
 * @param {string|Date|number} dateValue - The date value to format
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateValue, locale = 'en-US', options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return formatDate(dateValue, locale, defaultOptions);
};

/**
 * Safely formats a date value to a relative time string (e.g., "2 days ago")
 * @param {string|Date|number} dateValue - The date value to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateValue) => {
  try {
    if (!dateValue) return 'N/A';
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Checks if a date value is valid
 * @param {any} dateValue - The date value to validate
 * @returns {boolean} True if the date is valid
 */
export const isValidDate = (dateValue) => {
  try {
    const date = new Date(dateValue);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Converts various date formats to ISO string
 * @param {string|Date|number} dateValue - The date value to convert
 * @returns {string} ISO string or null if invalid
 */
export const toISOString = (dateValue) => {
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
};
