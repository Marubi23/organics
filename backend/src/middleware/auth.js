const jwt = require('jsonwebtoken');
const { collections } = require('../../config/firebase');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const userDoc = await collections.users.doc(decoded.userId).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = userDoc.data();
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Attach user to request
    req.user = {
      id: decoded.userId,
      ...user
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Admin middleware
const adminMiddleware = async (req, res, next) => {
  try {
    await authMiddleware(req, res, () => {
      if (req.user.userType !== 'admin' && !req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied. Admin privileges required.'
        });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};