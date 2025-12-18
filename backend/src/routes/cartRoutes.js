const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const CartController = require('../controllers/cartController');

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.put('/update/:productId', CartController.updateQuantity);
router.delete('/remove/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

module.exports = router;