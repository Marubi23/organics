import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;
  
  // User stats
  userStats = {
    cartItems: 0,
    activeOrders: 0,
    favorites: 0,
    totalSpent: 0,
    points: 0,
    farmSize: 0
  };

  // Quick actions based on user type
  quickActions: any[] = [];

  // Recent activity
  recentActivity: any[] = [];

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Subscribe to auth changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserStats();
        this.loadQuickActions();
        this.loadRecentActivity();
      } else {
        // Clear data when user logs out
        this.userStats = {
          cartItems: 0,
          activeOrders: 0,
          favorites: 0,
          totalSpent: 0,
          points: 0,
          farmSize: 0
        };
        this.quickActions = [];
        this.recentActivity = [];
      }
    });
  }

  loadUserStats() {
    if (this.currentUser) {
      // Fix: Safely convert farmSize to number
      const farmSizeValue = this.currentUser.farmSize;
      const farmSize = farmSizeValue ? 
        (typeof farmSizeValue === 'string' ? parseFloat(farmSizeValue) : farmSizeValue) : 0;
      
      this.userStats = {
        cartItems: 3,
        activeOrders: 2,
        favorites: 5,
        totalSpent: 12500,
        points: this.currentUser.points || 0,
        farmSize: farmSize
      };
    }
  }

  loadQuickActions() {
    if (!this.currentUser) return;
    
    const userType = this.currentUser.userType || 'buyer';
    
    switch(userType) {
      case 'farmer':
        this.quickActions = [
          { icon: 'fas fa-shopping-cart', label: 'Order Inputs', route: '/products', color: 'green' },
          { icon: 'fas fa-user-md', label: 'Book Agronomist', route: '/consultations', color: 'blue' },
          { icon: 'fas fa-vial', label: 'Soil Test', route: '/services/soil-test', color: 'orange' },
          { icon: 'fas fa-seedling', label: 'My Crops', route: '/account/farm-data', color: 'brown' },
          { icon: 'fas fa-tractor', label: 'Equipment', route: '/services/equipment', color: 'red' },
          { icon: 'fas fa-graduation-cap', label: 'Training', route: '/training', color: 'purple' }
        ];
        break;
      
      case 'buyer':
        this.quickActions = [
          { icon: 'fas fa-shopping-cart', label: 'Shop Products', route: '/shop', color: 'green' },
          { icon: 'fas fa-box', label: 'Track Orders', route: '/account/orders', color: 'blue' },
          { icon: 'fas fa-heart', label: 'Favorites', route: '/account/favorites', color: 'red' },
          { icon: 'fas fa-truck', label: 'Delivery', route: '/delivery', color: 'orange' },
          { icon: 'fas fa-comments', label: 'Support', route: '/contact', color: 'purple' },
          { icon: 'fas fa-star', label: 'Reviews', route: '/reviews', color: 'yellow' }
        ];
        break;
      
      case 'distributor':
        this.quickActions = [
          { icon: 'fas fa-boxes', label: 'My Stock', route: '/distributor/stock', color: 'green' },
          { icon: 'fas fa-truck', label: 'Deliveries', route: '/distributor/deliveries', color: 'blue' },
          { icon: 'fas fa-chart-line', label: 'Sales Reports', route: '/distributor/reports', color: 'orange' },
          { icon: 'fas fa-users', label: 'My Customers', route: '/distributor/customers', color: 'red' },
          { icon: 'fas fa-file-invoice', label: 'Invoices', route: '/distributor/invoices', color: 'purple' },
          { icon: 'fas fa-cog', label: 'Settings', route: '/distributor/settings', color: 'yellow' }
        ];
        break;
      
      case 'agronomist':
        this.quickActions = [
          { icon: 'fas fa-calendar-check', label: 'My Schedule', route: '/agronomist/schedule', color: 'green' },
          { icon: 'fas fa-users', label: 'My Clients', route: '/agronomist/clients', color: 'blue' },
          { icon: 'fas fa-vial', label: 'Soil Tests', route: '/agronomist/soil-tests', color: 'orange' },
          { icon: 'fas fa-file-medical', label: 'Reports', route: '/agronomist/reports', color: 'red' },
          { icon: 'fas fa-graduation-cap', label: 'Training', route: '/agronomist/training', color: 'purple' },
          { icon: 'fas fa-cog', label: 'Settings', route: '/agronomist/settings', color: 'yellow' }
        ];
        break;
      
      case 'admin':
        this.quickActions = [
          { icon: 'fas fa-users', label: 'Users', route: '/admin/users', color: 'green' },
          { icon: 'fas fa-box', label: 'Orders', route: '/admin/orders', color: 'blue' },
          { icon: 'fas fa-chart-bar', label: 'Analytics', route: '/admin/analytics', color: 'orange' },
          { icon: 'fas fa-cog', label: 'Settings', route: '/admin/settings', color: 'red' },
          { icon: 'fas fa-file-invoice', label: 'Reports', route: '/admin/reports', color: 'purple' },
          { icon: 'fas fa-bell', label: 'Notifications', route: '/admin/notifications', color: 'yellow' }
        ];
        break;
      
      default:
        this.quickActions = [
          { icon: 'fas fa-shopping-cart', label: 'Shop', route: '/shop', color: 'green' },
          { icon: 'fas fa-user', label: 'Profile', route: '/account/profile', color: 'blue' },
          { icon: 'fas fa-cog', label: 'Settings', route: '/account/settings', color: 'orange' }
        ];
    }
  }

  loadRecentActivity() {
    if (!this.currentUser) return;
    
    const userType = this.currentUser.userType;
    
    // Common activities for all users
    const commonActivities = [
      { type: 'order', title: 'Order #12345', description: 'Liquid NPK Plus - 20L', date: '2024-01-15', status: 'Delivered' },
      { type: 'view', title: 'Viewed Product', description: 'BSF Larvae - Wet', date: '2024-01-14' },
      { type: 'favorite', title: 'Added to Favorites', description: 'Organic Avocados', date: '2024-01-10' }
    ];
    
    // Type-specific activities
    const typeSpecificActivities = {
      farmer: [
        { type: 'consultation', title: 'Agronomist Visit', description: 'Soil analysis booked', date: '2024-01-12', status: 'Scheduled' },
        { type: 'training', title: 'Training Completed', description: 'Organic Farming Basics', date: '2024-01-08', status: 'Completed' }
      ],
      buyer: [
        { type: 'review', title: 'Product Review', description: 'Rated Biofertilizer 5 stars', date: '2024-01-11' },
        { type: 'delivery', title: 'Delivery Scheduled', description: 'Order #12346', date: '2024-01-13', status: 'Scheduled' }
      ],
      distributor: [
        { type: 'stock', title: 'Stock Updated', description: 'Added 50 units BSF Larvae', date: '2024-01-12' },
        { type: 'delivery', title: 'Delivery Made', description: 'To 3 customers', date: '2024-01-10', status: 'Completed' }
      ],
      agronomist: [
        { type: 'consultation', title: 'Client Consultation', description: 'Soil analysis for John Kamau', date: '2024-01-12', status: 'Completed' },
        { type: 'report', title: 'Report Submitted', description: 'Farm assessment report', date: '2024-01-09', status: 'Submitted' }
      ]
    };
    
    // Combine activities
    this.recentActivity = [
      ...commonActivities,
      ...(typeSpecificActivities[userType as keyof typeof typeSpecificActivities] || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  logout() {
    this.authService.logout();
  }

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  getActivityIcon(type: string): string {
    const iconMap: {[key: string]: string} = {
      'order': 'fas fa-box',
      'view': 'fas fa-eye',
      'consultation': 'fas fa-user-md',
      'favorite': 'fas fa-heart',
      'training': 'fas fa-graduation-cap',
      'review': 'fas fa-star',
      'delivery': 'fas fa-truck',
      'stock': 'fas fa-boxes',
      'report': 'fas fa-file-medical'
    };
    return iconMap[type] || 'fas fa-circle';
  }

  getActionColor(color: string): string {
    const colorMap: {[key: string]: string} = {
      'green': '#108c1a',
      'blue': '#007bff',
      'orange': '#FFA500',
      'red': '#dc3545',
      'purple': '#6f42c1',
      'yellow': '#FFD700',
      'brown': '#a0512d'
    };
    return colorMap[color] || '#108c1a';
  }

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getUserTypeDisplay(): string {
    if (!this.currentUser) return 'Guest';
    
    const typeMap: {[key: string]: string} = {
      'farmer': 'Farmer',
      'buyer': 'Customer',
      'distributor': 'Distributor',
      'agronomist': 'Agronomist',
      'admin': 'Administrator'
    };
    
    return typeMap[this.currentUser.userType] || 'User';
  }

  getFarmSizeDisplay(): string {
    const farmSize = this.userStats.farmSize;
    if (farmSize === 0 || farmSize === undefined) return 'Not specified';
    return `${farmSize} acres`;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}