const { collections, increment } = require('../../config/firebase');
const { formatPhoneNumber } = require('../utils/helpers');

class OrderController {
  // Create new order
  static async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const {
        deliveryAddress,
        deliveryMethod = 'standard',
        paymentMethod = 'mpesa',
        notes
      } = req.body;
      
      // Validate required fields
      if (!deliveryAddress) {
        return res.status(400).json({
          success: false,
          error: 'Delivery address is required'
        });
      }
      
      // Get user's cart
      const cartRef = collections.cart.doc(userId);
      const cartDoc = await cartRef.get();
      
      if (!cartDoc.exists || cartDoc.data().items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Cart is empty'
        });
      }
      
      const cart = cartDoc.data();
      
      // Get user details
      const userDoc = await collections.users.doc(userId).get();
      const user = userDoc.data();
      
      // Calculate shipping
      let shippingCost = 200; // Default
      if (deliveryMethod === 'express') shippingCost = 500;
      if (deliveryMethod === 'pickup') shippingCost = 0;
      
      // Calculate tax (16% VAT)
      const tax = cart.subtotal * 0.16;
      const total = cart.subtotal + shippingCost + tax;
      
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Create order
      const orderRef = collections.orders.doc();
      const orderData = {
        id: orderRef.id,
        orderId,
        userId,
        userPhone: user.phoneNumber,
        userName: user.fullName,
        items: cart.items,
        subtotal: cart.subtotal,
        shippingCost,
        tax,
        total,
        currency: 'KES',
        deliveryAddress,
        deliveryMethod,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        notes: notes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await orderRef.set(orderData);
      
      // Clear cart
      await cartRef.set({
        userId,
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingCost: 0,
        tax: 0,
        total: 0,
        updatedAt: new Date()
      });
      
      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order: orderData }
      });
      
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create order'
      });
    }
  }
  
  // Get user orders
  static async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      
      const snapshot = await collections.orders
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      
      res.json({
        success: true,
        data: { orders }
      });
      
    } catch (error) {
      console.error('Get user orders error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get orders'
      });
    }
  }
}

module.exports = OrderController;