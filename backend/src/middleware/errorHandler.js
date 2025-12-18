const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(e => e.message);
  }
  
  if (err.code === 11000) { // MongoDB duplicate key
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Firebase errors
  if (err.code === 'permission-denied') {
    statusCode = 403;
    message = 'Permission denied';
  }

  const response = {
    success: false,
    error: message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;