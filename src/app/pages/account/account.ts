// src/app/pages/account/account.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface User {
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  points: number;
  farmSize: number;
  county: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TitleCasePipe],
  templateUrl: './account.html',
  styleUrls: ['./account.css']
})
export class AccountComponent implements OnInit {
  // Current user data
  currentUser: User = {
    fullName: 'Felix Marubi',
    email: 'felix@mzuriorganics.com',
    phone: '+254712683708',
    userType: 'farmer',
    points: 3000,
    farmSize: 5.5,
    county: 'Nairobi'
  };

  // User stats
  userStats = {
    cartItems: 3,
    activeOrders: 2,
    favorites: 5,
    totalSpent: 12500,
    points: 1250,
    farmSize: 5.5
  };

  // Quick actions
  quickActions = [
    { icon: 'fas fa-shopping-cart', label: 'Order Inputs', route: '/products', color: 'green' },
    { icon: 'fas fa-user-md', label: 'Book Agronomist', route: '/consultations', color: 'blue' },
    { icon: 'fas fa-vial', label: 'Soil Test', route: '/services/soil-test', color: 'orange' },
    { icon: 'fas fa-seedling', label: 'My Crops', route: '/account/farm-data', color: 'brown' },
    { icon: 'fas fa-tractor', label: 'Equipment', route: '/services/equipment', color: 'red' },
    { icon: 'fas fa-graduation-cap', label: 'Training', route: '/training', color: 'purple' }
  ];

  // Recent activity
  recentActivity = [
    { type: 'order', title: 'Order #12345', description: 'Liquid NPK Plus - 20L', date: '2024-01-15', status: 'Delivered' },
    { type: 'consultation', title: 'Agronomist Visit', description: 'Soil analysis booked', date: '2024-01-12', status: 'Scheduled' },
    { type: 'training', title: 'Training Completed', description: 'Organic Farming Basics', date: '2024-01-08', status: 'Completed' },
    { type: 'view', title: 'Viewed Product', description: 'BSF Larvae - Wet', date: '2024-01-14' },
    { type: 'favorite', title: 'Added to Favorites', description: 'Organic Avocados', date: '2024-01-10' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Load user data (in real app, this would come from API)
    this.loadUserData();
  }

  loadUserData() {
    // Simulate loading user data
    console.log('Loading user data...');
    
    // In a real app, you would fetch from API:
    // this.userService.getUserProfile().subscribe(user => {
    //   this.currentUser = user;
    //   this.updateUserStats();
    // });
  }

  updateUserStats() {
    // Update stats based on current user
    this.userStats = {
      cartItems: 3,
      activeOrders: 2,
      favorites: 5,
      totalSpent: 12500,
      points: this.currentUser.points,
      farmSize: this.currentUser.farmSize
    };
  }

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getUserInitials(): string {
    if (!this.currentUser.fullName) return 'U';
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
      'green': '#1a7f27',
      'blue': '#007bff',
      'orange': '#FFA500',
      'red': '#dc3545',
      'purple': '#6f42c1',
      'yellow': '#FFD700',
      'brown': '#a0512d'
    };
    return colorMap[color] || '#1a7f27';
  }

  getUserTypeDisplay(): string {
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
    const farmSize = this.currentUser.farmSize;
    if (farmSize === 0 || farmSize === undefined) return 'Not specified';
    return `${farmSize} acres`;
  }

  formatCurrency(amount: number): string {
    return `KSh ${amount.toLocaleString('en-KE')}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  updateProfile() {
    // Update profile logic
    console.log('Updating profile:', this.currentUser);
    alert('Profile updated successfully!');
  }

  logout() {
    // Logout logic
    console.log('Logging out...');
    this.router.navigate(['/']);
  }
}