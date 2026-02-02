// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Define CartItem locally to avoid import issues
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  units: string;
}

export interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    fullName?: string;
  };
  delivery: {
    county: string;
    town: string;
    address: string;
    deliveryNotes?: string;
    method: string;
    cost: number;
    selectedOption: string;
  };
  items: CartItem[];
  total: number;
  subtotal: number;
  deliveryCost: number;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'mpesa_till';
  tillNumber: string;
  whatsappNumber: string;
  createdAt: string;
  updatedAt: string;
  paymentConfirmed?: boolean;
  paymentConfirmationDate?: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemsCount: number;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://api.mzuriorganics.com/orders'; // Replace with your actual API
  private localStorageKey = 'mzuri_orders';
  
  // Update these with your actual business details
  private readonly DEFAULT_TILL_NUMBER = '8589836';
  private readonly DEFAULT_WHATSAPP_NUMBER = '254746060274'; // Your WhatsApp number

  constructor(private http: HttpClient) {
    // Initialize localStorage if empty
    this.initializeLocalStorage();
  }

  /**
   * Create a new order
   */
  createOrder(orderData: Partial<Order>): Observable<CreateOrderResponse> {
    // Generate order ID
    const orderId = this.generateOrderId();
    const timestamp = new Date().toISOString();
    
    const order: Order = {
      id: orderId,
      customer: {
        ...orderData.customer!,
        fullName: `${orderData.customer?.firstName} ${orderData.customer?.lastName}`
      },
      delivery: orderData.delivery!,
      items: orderData.items || [],
      total: orderData.total || 0,
      subtotal: orderData.subtotal || 0,
      deliveryCost: orderData.deliveryCost || 0,
      status: 'pending_payment',
      paymentMethod: 'mpesa_till',
      tillNumber: this.DEFAULT_TILL_NUMBER,
      whatsappNumber: this.DEFAULT_WHATSAPP_NUMBER,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // For demo: Save to localStorage
    const saved = this.saveOrderToLocalStorage(order);
    
    if (saved) {
      // In production, you would send to your backend:
      // return this.http.post<CreateOrderResponse>(this.apiUrl, order)
      //   .pipe(
      //     catchError(error => {
      //       console.error('Error creating order:', error);
      //       return of({ success: false, error: error.message });
      //     })
      //   );
      
      return of({ success: true, orderId });
    } else {
      return of({ success: false, error: 'Failed to save order locally' });
    }
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Observable<Order | null> {
    // Check localStorage first
    const order = this.getOrderFromLocalStorage(orderId);
    
    if (order) {
      return of(order);
    }
    
    // If not found, try API
    // return this.http.get<Order>(`${this.apiUrl}/${orderId}`)
    //   .pipe(
    //     catchError(error => {
    //       console.error('Error fetching order:', error);
    //       return of(null);
    //     })
    //   );
    
    return of(null);
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: Order['status']): Observable<boolean> {
    const orders = this.getOrdersFromLocalStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1) {
      orders[orderIndex].status = status;
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      // Set estimated delivery date when paid
      if (status === 'paid') {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days from now
        orders[orderIndex].estimatedDeliveryDate = deliveryDate.toISOString();
        orders[orderIndex].paymentConfirmationDate = new Date().toISOString();
        orders[orderIndex].paymentConfirmed = true;
      }
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(orders));
      return of(true);
    }
    
    return of(false);
  }

  /**
   * Confirm payment for an order
   */
  confirmPayment(orderId: string, paymentDetails: {
    mpesaCode?: string;
    amount: number;
    phoneNumber: string;
  }): Observable<boolean> {
    const orders = this.getOrdersFromLocalStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1) {
      const order = orders[orderIndex];
      
      // Verify amount matches
      if (Math.abs(order.total - paymentDetails.amount) > 10) { // Allow small rounding differences
        console.warn(`Payment amount mismatch: Expected ${order.total}, got ${paymentDetails.amount}`);
      }
      
      orders[orderIndex].status = 'paid';
      orders[orderIndex].paymentConfirmed = true;
      orders[orderIndex].paymentConfirmationDate = new Date().toISOString();
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      // Add payment notes
      if (paymentDetails.mpesaCode) {
        orders[orderIndex].notes = `Payment confirmed via M-Pesa. Transaction: ${paymentDetails.mpesaCode}`;
      }
      
      // Set estimated delivery date
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days from now
      orders[orderIndex].estimatedDeliveryDate = deliveryDate.toISOString();
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(orders));
      
      // In production, send to backend
      // return this.http.post<boolean>(`${this.apiUrl}/${orderId}/confirm-payment`, paymentDetails)
      //   .pipe(
      //     catchError(() => of(false))
      //   );
      
      return of(true);
    }
    
    return of(false);
  }

  /**
   * Get all orders for a customer (by phone or email)
   */
  getCustomerOrders(identifier: string): Observable<Order[]> {
    const orders = this.getOrdersFromLocalStorage();
    
    // Filter orders by customer phone or email
    const customerOrders = orders.filter(order => 
      (order.customer.phoneNumber && order.customer.phoneNumber.includes(identifier)) || 
      (order.customer.email && order.customer.email.includes(identifier))
    );
    
    // Sort by creation date (newest first)
    customerOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return of(customerOrders);
  }

  /**
   * Get order summaries for dashboard
   */
  getOrderSummaries(): Observable<OrderSummary[]> {
    const orders = this.getOrdersFromLocalStorage();
    
    const summaries: OrderSummary[] = orders.map(order => ({
      orderNumber: order.id,
      customerName: order.customer.fullName || `${order.customer.firstName} ${order.customer.lastName}`,
      totalAmount: order.total,
      status: this.formatStatus(order.status),
      createdAt: new Date(order.createdAt).toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }));
    
    return of(summaries);
  }

  /**
   * Generate WhatsApp message for order confirmation
   */
  generateWhatsAppMessage(order: Order): string {
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name} - KES ${(item.price * item.quantity).toLocaleString()}`)
      .join('\n');
    
    const deliveryCostDisplay = order.deliveryCost === 0 ? 'FREE' : `KES ${order.deliveryCost.toLocaleString()}`;
    
    const message = `
*MZURI ORGANICS - ORDER CONFIRMATION*

📋 *Order #:* ${order.id}
👤 *Customer:* ${order.customer.firstName} ${order.customer.lastName}
📱 *Phone:* ${order.customer.phoneNumber}
📧 *Email:* ${order.customer.email}

📍 *Delivery Address:*
${order.delivery.town}, ${order.delivery.county}
${order.delivery.address}
${order.delivery.deliveryNotes ? `📝 *Notes:* ${order.delivery.deliveryNotes}` : ''}

🛒 *Items Ordered:*
${itemsList}

💰 *Payment Summary:*
Subtotal: KES ${order.subtotal.toLocaleString()}
Delivery: ${deliveryCostDisplay}
*Total: KES ${order.total.toLocaleString()}*

💳 *Payment Method:* M-Pesa Till ${order.tillNumber}

✅ *I have made the payment and attached my M-Pesa confirmation screenshot.*

Thank you for choosing Mzuri Organics! 🌿
    `.trim();
    
    return encodeURIComponent(message);
  }

  /**
   * Generate WhatsApp URL with pre-filled message
   */
  generateWhatsAppUrl(order: Order): string {
    const message = this.generateWhatsAppMessage(order);
    return `https://wa.me/${order.whatsappNumber}?text=${message}`;
  }

  /**
   * Validate order data
   */
  validateOrder(orderData: Partial<Order>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Customer validation
    if (!orderData.customer?.firstName?.trim()) errors.push('First name is required');
    if (!orderData.customer?.lastName?.trim()) errors.push('Last name is required');
    if (!orderData.customer?.email?.trim()) errors.push('Email is required');
    if (!this.isValidEmail(orderData.customer?.email)) errors.push('Invalid email format');
    if (!orderData.customer?.phoneNumber?.trim()) errors.push('Phone number is required');
    if (!this.isValidPhone(orderData.customer?.phoneNumber)) errors.push('Invalid phone number format');

    // Delivery validation
    if (!orderData.delivery?.county?.trim()) errors.push('County is required');
    if (!orderData.delivery?.town?.trim()) errors.push('Town is required');
    if (!orderData.delivery?.address?.trim()) errors.push('Address is required');
    if (orderData.delivery?.address && orderData.delivery.address.length < 10) {
      errors.push('Address is too short. Please provide more details');
    }

    // Items validation
    if (!orderData.items || orderData.items.length === 0) errors.push('No items in order');
    if (orderData.total && orderData.total <= 0) errors.push('Total amount must be greater than 0');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email is valid
   */
  private isValidEmail(email: string = ''): boolean {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Check if phone number is valid (Kenya)
   */
  private isValidPhone(phone: string = ''): boolean {
    if (!phone) return false;
    const phoneRegex = /^(07|7|01)\d{8}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  /**
   * Generate order ID (MZ + timestamp + random)
   */
  generateOrderId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MZ${timestamp}${random}`;
  }

  /**
   * Format status for display
   */
  private formatStatus(status: Order['status']): string {
    const statusMap: Record<Order['status'], string> = {
      'pending_payment': 'Pending Payment',
      'paid': 'Paid - Processing',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  /**
   * Initialize localStorage with empty array if not exists
   */
  private initializeLocalStorage(): void {
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }

  /**
   * Save order to localStorage
   */
  private saveOrderToLocalStorage(order: Order): boolean {
    try {
      const orders = this.getOrdersFromLocalStorage();
      orders.push(order);
      localStorage.setItem(this.localStorageKey, JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
      return false;
    }
  }

  /**
   * Get order from localStorage
   */
  private getOrderFromLocalStorage(orderId: string): Order | null {
    try {
      const orders = this.getOrdersFromLocalStorage();
      return orders.find(order => order.id === orderId) || null;
    } catch (error) {
      console.error('Error reading order from localStorage:', error);
      return null;
    }
  }

  /**
   * Get all orders from localStorage
   */
  getOrdersFromLocalStorage(): Order[] {
    try {
      const ordersJson = localStorage.getItem(this.localStorageKey);
      if (!ordersJson) {
        return [];
      }
      return JSON.parse(ordersJson) as Order[];
    } catch (error) {
      console.error('Error reading orders from localStorage:', error);
      return [];
    }
  }

  /**
   * Clear all orders (for testing)
   */
  clearOrders(): void {
    localStorage.removeItem(this.localStorageKey);
    this.initializeLocalStorage();
  }

  /**
   * Get statistics for dashboard
   */
  getStatistics(): Observable<{
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    recentOrders: Order[];
  }> {
    const orders = this.getOrdersFromLocalStorage();
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending_payment').length;
    const totalRevenue = orders
      .filter(o => o.status === 'paid' || o.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Get recent orders (last 5)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    return of({
      totalOrders,
      pendingOrders,
      totalRevenue,
      averageOrderValue,
      recentOrders
    });
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: Order['status']): Observable<Order[]> {
    const orders = this.getOrdersFromLocalStorage();
    const filteredOrders = orders.filter(order => order.status === status);
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return of(filteredOrders);
  }

  /**
   * Search orders by customer name, phone, or order ID
   */
  searchOrders(query: string): Observable<Order[]> {
    const orders = this.getOrdersFromLocalStorage();
    const searchTerm = query.toLowerCase().trim();
    
    const filteredOrders = orders.filter(order => 
      order.id.toLowerCase().includes(searchTerm) ||
      order.customer.firstName.toLowerCase().includes(searchTerm) ||
      order.customer.lastName.toLowerCase().includes(searchTerm) ||
      order.customer.phoneNumber.includes(searchTerm) ||
      order.customer.email.toLowerCase().includes(searchTerm)
    );
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return of(filteredOrders);
  }

  /**
   * Update delivery tracking info
   */
  updateTrackingInfo(orderId: string, trackingInfo: {
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    notes?: string;
  }): Observable<boolean> {
    const orders = this.getOrdersFromLocalStorage();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1) {
      if (trackingInfo.trackingNumber) {
        orders[orderIndex].trackingNumber = trackingInfo.trackingNumber;
      }
      if (trackingInfo.estimatedDeliveryDate) {
        orders[orderIndex].estimatedDeliveryDate = trackingInfo.estimatedDeliveryDate;
      }
      if (trackingInfo.notes) {
        orders[orderIndex].notes = trackingInfo.notes;
      }
      orders[orderIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(orders));
      return of(true);
    }
    
    return of(false);
  }

  /**
   * Delete an order (for admin use)
   */
  deleteOrder(orderId: string): Observable<boolean> {
    const orders = this.getOrdersFromLocalStorage();
    const initialLength = orders.length;
    const filteredOrders = orders.filter(order => order.id !== orderId);
    
    if (filteredOrders.length < initialLength) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredOrders));
      return of(true);
    }
    
    return of(false);
  }

  /**
   * Get order count by status
   */
  getOrderCounts(): Observable<Record<Order['status'], number>> {
    const orders = this.getOrdersFromLocalStorage();
    
    const counts: Record<Order['status'], number> = {
      'pending_payment': 0,
      'paid': 0,
      'processing': 0,
      'shipped': 0,
      'delivered': 0,
      'cancelled': 0
    };
    
    orders.forEach(order => {
      counts[order.status]++;
    });
    
    return of(counts);
  }

  /**
   * Export orders to CSV
   */
  exportOrdersToCSV(): Observable<string> {
    const orders = this.getOrdersFromLocalStorage();
    
    // CSV headers
    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Phone',
      'Status',
      'Total Amount',
      'Delivery Cost',
      'Subtotal',
      'Items Count',
      'Created Date',
      'County',
      'Town'
    ];
    
    // CSV rows
    const rows = orders.map(order => [
      order.id,
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.customer.email,
      order.customer.phoneNumber,
      this.formatStatus(order.status),
      order.total.toString(),
      order.deliveryCost.toString(),
      order.subtotal.toString(),
      order.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      new Date(order.createdAt).toLocaleDateString(),
      order.delivery.county,
      order.delivery.town
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return of(csvContent);
  }

  /**
   * Get monthly revenue statistics
   */
  getMonthlyRevenue(): Observable<Array<{ month: string; revenue: number }>> {
    const orders = this.getOrdersFromLocalStorage();
    const paidOrders = orders.filter(o => o.status === 'paid' || o.status === 'delivered');
    
    // Group by month
    const monthlyRevenue: { [key: string]: number } = {};
    
    paidOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] = 0;
      }
      
      monthlyRevenue[monthYear] += order.total;
    });
    
    // Convert to array and sort by date
    const result = Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        month,
        revenue
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    return of(result);
  }
}