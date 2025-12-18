const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth-specific rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 auth requests per hour
  message: {
    success: false,
    error: 'Too many login attempts, please try again after an hour'
  }
});

// Payment rate limiter
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit to 5 payment attempts per 5 minutes
  message: {
    success: false,
    error: 'Too many payment attempts, please try again after 5 minutes'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter
};