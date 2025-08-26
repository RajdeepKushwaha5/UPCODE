import fs from 'fs';
import path from 'path';

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
      pid: process.pid,
      env: process.env.NODE_ENV || 'development'
    };
    
    return JSON.stringify(logEntry) + '\n';
  }

  writeToFile(filename, content) {
    try {
      const logFile = path.join(this.logDir, filename);
      fs.appendFileSync(logFile, content);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('INFO', message, meta);
    this.writeToFile('app.log', formattedMessage);
    
    if (process.env.NODE_ENV === 'development') {
    }
  }

  error(message, error = null, meta = {}) {
    const errorMeta = {
      ...meta,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : null
    };
    
    const formattedMessage = this.formatMessage('ERROR', message, errorMeta);
    this.writeToFile('error.log', formattedMessage);
    
    // Always log errors to console
    console.error(`[ERROR] ${message}`, errorMeta);
  }

  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('WARN', message, meta);
    this.writeToFile('app.log', formattedMessage);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, meta);
    }
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message, meta);
      this.writeToFile('debug.log', formattedMessage);
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }

  // API-specific logging methods
  apiRequest(method, url, userId = null, meta = {}) {
    this.info(`API Request: ${method} ${url}`, {
      type: 'api_request',
      method,
      url,
      userId,
      ...meta
    });
  }

  apiError(method, url, error, userId = null, meta = {}) {
    this.error(`API Error: ${method} ${url}`, error, {
      type: 'api_error',
      method,
      url,
      userId,
      ...meta
    });
  }

  authAttempt(email, success, meta = {}) {
    const level = success ? 'info' : 'warn';
    const message = `Authentication ${success ? 'successful' : 'failed'} for ${email}`;
    
    this[level](message, {
      type: 'auth_attempt',
      email,
      success,
      ...meta
    });
  }

  securityEvent(event, severity = 'medium', meta = {}) {
    const message = `Security Event: ${event}`;
    
    this.error(message, null, {
      type: 'security_event',
      event,
      severity,
      ...meta
    });
  }

  performanceLog(operation, duration, meta = {}) {
    this.info(`Performance: ${operation} took ${duration}ms`, {
      type: 'performance',
      operation,
      duration,
      ...meta
    });
  }

  // Database operation logging
  dbQuery(collection, operation, duration = null, meta = {}) {
    this.debug(`DB Query: ${operation} on ${collection}`, {
      type: 'db_query',
      collection,
      operation,
      duration,
      ...meta
    });
  }

  dbError(collection, operation, error, meta = {}) {
    this.error(`DB Error: ${operation} on ${collection}`, error, {
      type: 'db_error',
      collection,
      operation,
      ...meta
    });
  }

  // Code execution logging
  codeExecution(language, userId, problemId, success, meta = {}) {
    this.info(`Code execution: ${language} by ${userId} for problem ${problemId}`, {
      type: 'code_execution',
      language,
      userId,
      problemId,
      success,
      ...meta
    });
  }

  // Cleanup old log files (call this periodically)
  cleanup(daysToKeep = 7) {
    try {
      const files = fs.readdirSync(this.logDir);
      const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          this.info(`Cleaned up old log file: ${file}`);
        }
      });
    } catch (error) {
      this.error('Failed to cleanup log files', error);
    }
  }
}

// Create singleton instance
const logger = new Logger();

// Error handling middleware
export function withErrorLogging(handler) {
  return async (request, context) => {
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    
    try {
      // Extract user ID from session if available
      const userId = context?.session?.user?._id || 'anonymous';
      
      logger.apiRequest(method, url, userId, {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
      });

      const response = await handler(request, context);
      
      const duration = Date.now() - startTime;
      logger.performanceLog(`${method} ${url}`, duration, { userId });
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const userId = context?.session?.user?._id || 'anonymous';
      
      logger.apiError(method, url, error, userId, {
        duration,
        userAgent: request.headers.get('user-agent'),
      });
      
      // Re-throw the error for proper error handling
      throw error;
    }
  };
}

export default logger;
