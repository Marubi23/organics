const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const PaymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes
router.use(authMiddleware);

router.get('/', OrderController.getUserOrders);
router.post('/', OrderController.createOrder);
router.post('/pay/mpesa', PaymentController.processMpesaPayment);

module.exports = router;