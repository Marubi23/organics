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
      this.userStats = {
        cartItems: 3,
        activeOrders: 2,
        favorites: 5,
        totalSpent: 12500,
        points: 450,
        farmSize: this.currentUser?.farmSize ? parseFloat(this.currentUser.farmSize) : 0
      };
    }
  }

  loadQuickActions() {
    if (!this.currentUser) return;
    
    const userType = this.currentUser?.userType || 'buyer';
    
    if (userType === 'farmer') {
      this.quickActions = [
        { icon: 'fas fa-shopping-cart', label: 'Order Inputs', route: '/products', color: 'green' },
        { icon: 'fas fa-user-md', label: 'Book Agronomist', route: '/consultations', color: 'blue' },
        { icon: 'fas fa-vial', label: 'Soil Test', route: '/services/soil-test', color: 'orange' },
        { icon: 'fas fa-seedling', label: 'My Crops', route: '/account/farm-data', color: 'brown' },
        { icon: 'fas fa-tractor', label: 'Equipment', route: '/services/equipment', color: 'red' },
        { icon: 'fas fa-graduation-cap', label: 'Training', route: '/training', color: 'purple' }
      ];
    } else if (userType === 'buyer') {
      this.quickActions = [
        { icon: 'fas fa-shopping-cart', label: 'Shop Products', route: '/shop', color: 'green' },
        { icon: 'fas fa-box', label: 'Track Orders', route: '/account/orders', color: 'blue' },
        { icon: 'fas fa-heart', label: 'Favorites', route: '/account/favorites', color: 'red' },
        { icon: 'fas fa-truck', label: 'Delivery', route: '/delivery', color: 'orange' },
        { icon: 'fas fa-comments', label: 'Support', route: '/contact', color: 'purple' },
        { icon: 'fas fa-star', label: 'Reviews', route: '/reviews', color: 'yellow' }
      ];
    }
  }

  loadRecentActivity() {
    if (!this.currentUser) return;
    
    this.recentActivity = [
      { type: 'order', title: 'Order #12345', description: 'Liquid NPK Plus - 20L', date: '2024-01-15', status: 'Delivered' },
      { type: 'view', title: 'Viewed Product', description: 'BSF Larvae - Wet', date: '2024-01-14' },
      { type: 'consultation', title: 'Agronomist Visit', description: 'Soil analysis booked', date: '2024-01-12', status: 'Scheduled' },
      { type: 'favorite', title: 'Added to Favorites', description: 'Organic Avocados', date: '2024-01-10' }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
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
    switch(type) {
      case 'order': return 'fas fa-box';
      case 'view': return 'fas fa-eye';
      case 'consultation': return 'fas fa-user-md';
      case 'favorite': return 'fas fa-heart';
      default: return 'fas fa-circle';
    }
  }

  getActionColor(color: string): string {
    switch(color) {
      case 'green': return '#108c1a';
      case 'blue': return '#007bff';
      case 'orange': return '#FFA500';
      case 'red': return '#dc3545';
      case 'purple': return '#6f42c1';
      case 'yellow': return '#FFD700';
      case 'brown': return '#a0512d';
      default: return '#108c1a';
    }
  }

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}