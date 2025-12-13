import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'mpesa' | 'cash' | 'bank';
  paymentStatus: 'paid' | 'pending' | 'failed';
  deliveryAddress: string;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  currentUser: any;
  
  // Orders data
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  
  // Filter options
  statusFilter: string = 'all';
  dateFilter: string = 'all';
  
  // View mode
  viewMode: 'list' | 'grid' = 'list';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  
  // Loading state
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/account/login']);
      return;
    }
    
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Mock orders data
      this.orders = [
        {
          id: '1',
          orderNumber: 'MZ-2024-00123',
          date: new Date('2024-01-15'),
          items: [
            { id: '1', name: 'Liquid NPK Plus - 20L', quantity: 2, price: 1400, image: '/images/fertilizer.jpg', category: 'Biofertilizers' },
            { id: '2', name: 'BSF Larvae - Wet (1kg)', quantity: 1, price: 120, image: '/images/bsf-larvae.jpg', category: 'Protein Feeds' }
          ],
          totalAmount: 2920,
          status: 'delivered',
          paymentMethod: 'mpesa',
          paymentStatus: 'paid',
          deliveryAddress: 'Kinale Village, Lari, Kiambu',
          estimatedDelivery: new Date('2024-01-18'),
          trackingNumber: 'TRK123456789'
        },
        {
          id: '2',
          orderNumber: 'MZ-2024-00124',
          date: new Date('2024-01-20'),
          items: [
            { id: '3', name: 'Organic Avocados (Box of 20)', quantity: 1, price: 1200, image: '/images/avacado.jpg', category: 'Fruits' },
            { id: '4', name: 'Red Wigglers (500g)', quantity: 1, price: 3000, image: '/images/red-wigglers.jpg', category: 'Agricultural Inputs' }
          ],
          totalAmount: 4200,
          status: 'processing',
          paymentMethod: 'mpesa',
          paymentStatus: 'paid',
          deliveryAddress: 'Mountain View, Kangemi, Nairobi',
          estimatedDelivery: new Date('2024-01-25')
        },
        {
          id: '3',
          orderNumber: 'MZ-2024-00125',
          date: new Date('2024-01-10'),
          items: [
            { id: '5', name: 'Nursery Growing Media (50kg)', quantity: 3, price: 270, image: '/images/growing-media.jpg', category: 'Agricultural Inputs' },
            { id: '6', name: 'Organic Kale (Bundle)', quantity: 5, price: 900, image: '/images/kales.jpg', category: 'Vegetables' }
          ],
          totalAmount: 1710,
          status: 'shipped',
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          deliveryAddress: 'Limuru Town, Kiambu',
          estimatedDelivery: new Date('2024-01-12'),
          trackingNumber: 'TRK987654321'
        },
        {
          id: '4',
          orderNumber: 'MZ-2024-00126',
          date: new Date('2024-01-05'),
          items: [
            { id: '1', name: 'Liquid Urea Plus - 20L', quantity: 1, price: 700, image: '/images/urea.jpg', category: 'Biofertilizers' }
          ],
          totalAmount: 700,
          status: 'cancelled',
          paymentMethod: 'mpesa',
          paymentStatus: 'failed',
          deliveryAddress: 'Westlands, Nairobi'
        }
      ];
      
      this.filteredOrders = [...this.orders];
      this.isLoading = false;
    }, 1000);
  }

  // Apply filters
  applyFilters() {
    let filtered = [...this.orders];
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }
    
    // Apply date filter
    if (this.dateFilter !== 'all') {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      switch (this.dateFilter) {
        case 'last7':
          filtered = filtered.filter(order => order.date >= sevenDaysAgo);
          break;
        case 'last30':
          filtered = filtered.filter(order => order.date >= thirtyDaysAgo);
          break;
        case '2024':
          filtered = filtered.filter(order => order.date.getFullYear() === 2024);
          break;
      }
    }
    
    this.filteredOrders = filtered;
    this.currentPage = 1;
  }

  // Clear filters
  clearFilters() {
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.filteredOrders = [...this.orders];
    this.currentPage = 1;
  }

  // Get status display
  getStatusDisplay(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  // Get status color
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  // Get payment method display
  getPaymentMethodDisplay(method: string): string {
    switch (method) {
      case 'mpesa': return 'M-PESA';
      case 'cash': return 'Cash on Delivery';
      case 'bank': return 'Bank Transfer';
      default: return method;
    }
  }

  // Get order total items
  getOrderTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }

  // View order details
  viewOrder(orderId: string) {
    this.router.navigate(['/account/orders', orderId]);
  }

  // Reorder
  reorder(order: Order) {
    // Logic to add order items to cart
    console.log('Reordering:', order);
    // In real app: Add items to cart service
    this.router.navigate(['/cart']);
  }

  // Track order
  trackOrder(order: Order) {
    if (order.trackingNumber) {
      // Open tracking in new window or modal
      window.open(`https://track.mzuriorganics.com/${order.trackingNumber}`, '_blank');
    }
  }

  // Get paginated orders
  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  // Get total pages
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  // Change page
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}