const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// Temporary placeholder - create ProductController later
const ProductController = {
  getProducts: async (req, res) => {
    res.json({
      success: true,
      message: 'Products endpoint - to be implemented',
      data: []
    });
  },
  getProductById: async (req, res) => {
    res.json({
      success: true,
      message: 'Get product by ID - to be implemented',
      data: null
    });
  }
};

// Public routes
router.get('/', ProductController.getProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes (admin only)
router.post('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Create product - to be implemented'
  });
});

module.exports = router;