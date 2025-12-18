const { collections } = require('../../config/firebase');

class PaymentController {
  // Process M-Pesa payment
  static async processMpesaPayment(req, res) {
    try {
      const { orderId, phoneNumber, amount } = req.body;
      const userId = req.user.id;
      
      // For demo purposes - generate mock response
      const mpesaCode = `MPE${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      
      // Create payment record
      const paymentRef = collections.payments.doc();
      await paymentRef.set({
        id: paymentRef.id,
        paymentId: `PAY-${Date.now()}`,
        orderId,
        userId,
        phoneNumber: formatPhoneNumber(phoneNumber),
        amount: parseFloat(amount),
        currency: 'KES',
        method: 'mpesa',
        mpesaCode,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Update order status
      const orderRef = collections.orders.doc(orderId);
      await orderRef.update({
        paymentStatus: 'paid',
        mpesaCode,
        status: 'confirmed',
        updatedAt: new Date()
      });
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: { mpesaCode }
      });
      
    } catch (error) {
      console.error('M-Pesa payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process payment'
      });
    }
  }
}

module.exports = PaymentController;