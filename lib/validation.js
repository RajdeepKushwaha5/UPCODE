// Input validation utilities
import DOMPurify from 'isomorphic-dompurify';

export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
    required: true
  },
  username: {
    pattern: /^[a-zA-Z0-9_-]{3,20}$/,
    minLength: 3,
    maxLength: 20,
    required: true
  },
  password: {
    minLength: 8,
    maxLength: 128,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    required: true
  },
  problemTitle: {
    minLength: 3,
    maxLength: 100,
    required: true
  },
  code: {
    maxLength: 50000,
    required: true
  },
  mongoObjectId: {
    pattern: /^[0-9a-fA-F]{24}$/
  }
};

export class InputValidator {
  static sanitizeString(input) {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input.trim());
  }

  static sanitizeHtml(input) {
    if (typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href']
    });
  }

  static validateEmail(email) {
    const sanitized = this.sanitizeString(email);
    const rule = ValidationRules.email;
    
    if (rule.required && !sanitized) {
      throw new Error('Email is required');
    }
    
    if (sanitized.length > rule.maxLength) {
      throw new Error(`Email must be less than ${rule.maxLength} characters`);
    }
    
    if (!rule.pattern.test(sanitized)) {
      throw new Error('Invalid email format');
    }
    
    return sanitized;
  }

  static validateUsername(username) {
    const sanitized = this.sanitizeString(username);
    const rule = ValidationRules.username;
    
    if (rule.required && !sanitized) {
      throw new Error('Username is required');
    }
    
    if (sanitized.length < rule.minLength || sanitized.length > rule.maxLength) {
      throw new Error(`Username must be between ${rule.minLength} and ${rule.maxLength} characters`);
    }
    
    if (!rule.pattern.test(sanitized)) {
      throw new Error('Username can only contain letters, numbers, hyphens, and underscores');
    }
    
    return sanitized;
  }

  static validatePassword(password) {
    const rule = ValidationRules.password;
    
    if (rule.required && !password) {
      throw new Error('Password is required');
    }
    
    if (password.length < rule.minLength || password.length > rule.maxLength) {
      throw new Error(`Password must be between ${rule.minLength} and ${rule.maxLength} characters`);
    }
    
    if (!rule.pattern.test(password)) {
      throw new Error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
    }
    
    return password;
  }

  static validateCode(code) {
    if (typeof code !== 'string') {
      throw new Error('Code must be a string');
    }
    
    const rule = ValidationRules.code;
    
    if (rule.required && !code.trim()) {
      throw new Error('Code is required');
    }
    
    if (code.length > rule.maxLength) {
      throw new Error(`Code must be less than ${rule.maxLength} characters`);
    }
    
    // Basic code injection prevention
    const suspiciousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /XMLHttpRequest/,
      /fetch\s*\(/,
      /require\s*\(/,
      /import\s+.*\s+from/
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(code)) {
        throw new Error('Code contains potentially unsafe operations');
      }
    }
    
    return code;
  }

  static validateObjectId(id) {
    const sanitized = this.sanitizeString(id);
    const rule = ValidationRules.mongoObjectId;
    
    if (!rule.pattern.test(sanitized)) {
      throw new Error('Invalid ID format');
    }
    
    return sanitized;
  }

  static validatePagination(page, limit) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    if (pageNum < 1) {
      throw new Error('Page must be positive');
    }
    
    if (limitNum < 1 || limitNum > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    
    return { page: pageNum, limit: limitNum };
  }

  static validateLanguage(language) {
    const validLanguages = ['javascript', 'python', 'java', 'cpp', 'c'];
    const sanitized = this.sanitizeString(language).toLowerCase();
    
    if (!validLanguages.includes(sanitized)) {
      throw new Error(`Language must be one of: ${validLanguages.join(', ')}`);
    }
    
    return sanitized;
  }

  static validateJson(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }
}

// Rate limiting helper
export class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  isRateLimited(key, windowMs = 15 * 60 * 1000, maxRequests = 100) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return true;
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return false;
  }
}

export const rateLimiter = new RateLimiter();
