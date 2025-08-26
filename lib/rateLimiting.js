import { NextResponse } from 'next/server';
import { rateLimiter } from './validation';

// Rate limiting middleware
export function withRateLimit(handler, options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 100,
    skipSuccessfulRequests = false,
    keyGenerator = (request) => {
      const forwarded = request.headers.get('x-forwarded-for');
      return forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'anonymous';
    }
  } = options;

  return async (request, context) => {
    try {
      const key = keyGenerator(request);
      
      if (rateLimiter.isRateLimited(key, windowMs, maxRequests)) {
        return NextResponse.json(
          { 
            error: 'Too many requests',
            message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 60000} minutes.`,
            retryAfter: Math.ceil(windowMs / 1000)
          },
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil(windowMs / 1000).toString(),
              'X-RateLimit-Limit': maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': (Date.now() + windowMs).toString()
            }
          }
        );
      }

      const response = await handler(request, context);
      
      // Add rate limit headers to successful responses
      const remaining = Math.max(0, maxRequests - (rateLimiter.requests.get(keyGenerator(request)) || []).length);
      
      if (response instanceof Response) {
        response.headers.set('X-RateLimit-Limit', maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', (Date.now() + windowMs).toString());
      }
      
      return response;
      
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

// Specific rate limiters for different endpoints
export const authRateLimit = (handler) => withRateLimit(handler, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 login attempts per 15 minutes
});

export const codeExecutionRateLimit = (handler) => withRateLimit(handler, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 code executions per minute
});

export const apiRateLimit = (handler) => withRateLimit(handler, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 API requests per 15 minutes
});

export const strictRateLimit = (handler) => withRateLimit(handler, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 requests per 15 minutes for sensitive endpoints
});
