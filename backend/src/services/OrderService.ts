import { collections, getTimestamp } from '../config/firebase';
import { Order, Cart, Payment } from '../models/schemas';
import { CartService } from './CartService';
import { ProductRepository } from '../repositories/ProductRepository';

export class OrderService {
  // Create order from cart
  static async createOrder(
    userId: string,
    deliveryAddress: any,
    deliveryMethod: string,
    paymentMethod: string,
    notes?: string
  ): Promise<{ order: Order; paymentRequired: boolean }> {
    try {
      // Get user's cart
      const cart = await CartService.getCart(userId);
      
      if (cart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Validate stock availability
      for (const item of cart.items) {
        const product = await ProductRepository.getProductById(item.productId);
        if (!product || !product.inStock || product.stock < item.quantity) {
          throw new Error(`Product "${item.productName}" is out of stock or insufficient quantity`);
        }
      }
      
      // Generate order ID
      const orderCount = await this.getOrderCount();
      const orderId = `ORD-${new Date().getFullYear()}-${(orderCount + 1).toString().padStart(5, '0')}`;
      
      // Create order items
      const orderItems = cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        units: item.units,
        total: item.price * item.quantity
      }));
      
      // Calculate totals
      const subtotal = cart.subtotal;
      const shippingCost = deliveryMethod === 'express' ? 500 : 200;
      const tax = subtotal * 0.16;
      const total = subtotal + shippingCost + tax;
      
      // Create order
      const order: Order = {
        id: '', // Will be set by Firestore
        orderId,
        userId,
        userPhone: '', // Will be populated from user data
        userName: '', // Will be populated from user data
        items: orderItems,
        subtotal,
        shippingCost,
        tax,
        total,
        currency: 'KES',
        deliveryAddress,
        deliveryMethod: deliveryMethod as 'standard' | 'express' | 'pickup',
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod as 'mpesa' | 'cash' | 'card',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        notes
      };
      
      // Get user details
      const userDoc = await collections.users.doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        order.userPhone = userData?.phoneNumber || '';
        order.userName = userData?.fullName || '';
      }
      
      // Save order to database
      const orderRef = collections.orders.doc();
      order.id = orderRef.id;
      
      await orderRef.set(order);
      
      // Clear cart after successful order creation
      await CartService.clearCart(userId);
      
      // Update user stats
      await this.updateUserStats(userId, total);
      
      // Check if payment is required
      const paymentRequired = paymentMethod !== 'cash_on_delivery';
      
      return { order, paymentRequired };
      
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  
  // Process M-Pesa payment
  static async processMpesaPayment(orderId: string, mpesaCode: string, phoneNumber: string): Promise<Payment> {
    try {
      const orderDoc = await collections.orders.doc(orderId).get();
      if (!orderDoc.exists) throw new Error('Order not found');
      
      const order = orderDoc.data() as Order;
      
      // Generate payment ID
      const paymentCount = await this.getPaymentCount();
      const paymentId = `PAY-${new Date().getFullYear()}-${(paymentCount + 1).toString().padStart(5, '0')}`;
      
      // Create payment record
      const payment: Payment = {
        id: '', // Will be set by Firestore
        paymentId,
        orderId,
        userId: order.userId,
        mpesaCode,
        phoneNumber,
        amount: order.total,
        currency: 'KES',
        status: 'pending',
        verificationAttempts: 0,
        initiatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save payment
      const paymentRef = collections.payments.doc();
      payment.id = paymentRef.id;
      
      await paymentRef.set(payment);
      
      // Start payment verification (simulate M-Pesa verification)
      // In production, this would call M-Pesa API
      setTimeout(async () => {
        await this.verifyMpesaPayment(payment.id, mpesaCode);
      }, 5000);
      
      return payment;
      
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  // Verify M-Pesa payment (simulated)
  private static async verifyMpesaPayment(paymentId: string, mpesaCode: string): Promise<void> {
    try {
      const paymentRef = collections.payments.doc(paymentId);
      const paymentDoc = await paymentRef.get();
      
      if (!paymentDoc.exists) return;
      
      // Simulate M-Pesa verification
      // In reality, you would call Safaricom's API
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo
      
      if (isSuccess) {
        await paymentRef.update({
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date(),
          verificationAttempts: 1,
          mpesaResponse: {
            ResultCode: 0,
            ResultDesc: 'The service request is processed successfully.',
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: paymentDoc.data()?.amount },
                { Name: 'MpesaReceiptNumber', Value: mpesaCode },
                { Name: 'TransactionDate', Value: new Date().toISOString() }
              ]
            }
          }
        });
        
        // Update order status
        const payment = paymentDoc.data() as Payment;
        await this.updateOrderStatus(payment.orderId, 'confirmed', 'paid');
        
      } else {
        await paymentRef.update({
          status: 'failed',
          failedAt: new Date(),
          updatedAt: new Date(),
          verificationAttempts: 1,
          mpesaResponse: {
            ResultCode: 1,
            ResultDesc: 'The balance is insufficient for the transaction'
          }
        });
      }
      
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  }
  
  private static async getOrderCount(): Promise<number> {
    const snapshot = await collections.orders.count().get();
    return snapshot.data().count;
  }
  
  private static async getPaymentCount(): Promise<number> {
    const snapshot = await collections.payments.count().get();
    return snapshot.data().count;
  }
  
  private static async updateUserStats(userId: string, amount: number): Promise<void> {
    const statsRef = collections.users.doc(userId).collection('stats').doc('current');
    
    await statsRef.update({
      totalOrders: increment(1),
      totalSpent: increment(amount),
      successfulOrders: increment(1),
      lastOrderDate: new Date(),
      pointsEarned: increment(Math.floor(amount / 100)) // 1 point per 100 KES
    });
  }
  
  private static async updateOrderStatus(orderId: string, status: Order['status'], paymentStatus: Order['paymentStatus']): Promise<void> {
    await collections.orders.doc(orderId).update({
      status,
      paymentStatus,
      updatedAt: new Date()
    });
    
    // If order is confirmed, update product stock
    if (status === 'confirmed') {
      const orderDoc = await collections.orders.doc(orderId).get();
      const order = orderDoc.data() as Order;
      
      for (const item of order.items) {
        await ProductRepository.updateStock(item.productId, item.quantity);
      }
    }
  }
}