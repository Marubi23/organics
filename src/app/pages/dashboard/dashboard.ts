import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // User data
  currentUser: any = {};
  
  // Dashboard stats
  dashboardStats = {
    orders: {
      total: 3,
      pending: 1,
      delivered: 1,
      cancelled: 0,
      processing: 1 // Added processing property
    },
    points: {
      total: 1500,
      available: 1250,
      used: 250
    },
    farm: {
      size: 2.5,
      crops: ['Maize', 'Beans', 'Avocado'],
      livestock: ['Chickens', 'Dairy Cattle']
    },
    notifications: {
      unread: 3,
      total: 12
    }
  };

  // Recent orders
  recentOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      items: ['BSF Larvae (50kg)', 'Organic Fertilizer (25kg)'],
      total: 12500,
      status: 'delivered',
      statusColor: 'success'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-18',
      items: ['Red Wigglers (5kg)', 'Growing Media'],
      total: 8500,
      status: 'processing',
      statusColor: 'warning'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-20',
      items: ['Protein Feeds (100kg)'],
      total: 18000,
      status: 'pending',
      statusColor: 'info'
    }
  ];

  // Quick actions
  quickActions = [
    {
      icon: 'fas fa-shopping-cart',
      title: 'Place Order',
      description: 'Order farm inputs & products',
      route: '/account/orders',
      color: 'primary'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'View Farm Data',
      description: 'Monitor your farm metrics',
      route: '/account/farm-data',
      color: 'success'
    },
    {
      icon: 'fas fa-user-edit',
      title: 'Update Profile',
      description: 'Manage your account details',
      route: '/account/profile',
      color: 'info'
    },
    {
      icon: 'fas fa-gift',
      title: 'Redeem Points',
      description: 'Use your Mzuri points',
      route: '/account/points',
      color: 'warning'
    }
  ];

  // Upcoming tasks
  upcomingTasks = [
    {
      title: 'Soil Testing',
      date: 'Tomorrow',
      priority: 'high',
      icon: 'fas fa-vial'
    },
    {
      title: 'Order Fertilizer',
      date: 'In 3 days',
      priority: 'medium',
      icon: 'fas fa-seedling'
    },
    {
      title: 'Harvest Planning',
      date: 'Next week',
      priority: 'low',
      icon: 'fas fa-tractor'
    }
  ];

  // Weather data (simulated)
  weather = {
    location: 'Limuru, Kiambu',
    temperature: 18,
    condition: 'Partly Cloudy',
    humidity: 65,
    rainfall: 'Low',
    icon: 'fas fa-cloud-sun'
  };

  // Market insights
  marketInsights = [
    {
      product: 'BSF Larvae',
      price: 250,
      trend: 'up',
      change: '+5%',
      demand: 'High'
    },
    {
      product: 'Organic Fertilizer',
      price: 180,
      trend: 'stable',
      change: '0%',
      demand: 'Very High'
    },
    {
      product: 'Avocados',
      price: 120,
      trend: 'up',
      change: '+3%',
      demand: 'High'
    }
  ];

  // Charts data
  chartData = {
    sales: [65, 59, 80, 81, 56, 55, 40],
    crops: [30, 25, 20, 15, 10],
    cropLabels: ['Maize', 'Beans', 'Avocado', 'Kale', 'Other']
  };

  // Color palette for charts
  chartColors = ['#108c1a', '#2ed573', '#FFD700', '#2bcbba', '#9b59b6'];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  loadUserData() {
    this.currentUser = this.authService.getCurrentUser() || {};
  }

  loadDashboardData() {
    // Simulate API call for dashboard data
    setTimeout(() => {
      // Update stats based on user type
      if (this.authService.isFarmer()) {
        this.dashboardStats.farm = {
          size: this.currentUser.farmSize || 0,
          crops: this.currentUser.mainCrops || [],
          livestock: this.currentUser.livestock || []
        };
        
        // Update orders count based on recent orders
        this.dashboardStats.orders.total = this.recentOrders.length;
        this.dashboardStats.orders.delivered = this.recentOrders.filter(o => o.status === 'delivered').length;
        this.dashboardStats.orders.pending = this.recentOrders.filter(o => o.status === 'pending').length;
        this.dashboardStats.orders.processing = this.recentOrders.filter(o => o.status === 'processing').length;
      }
    }, 500);
  }

  getUserInitials(): string {
    const name = this.currentUser?.fullName || 'User';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getUserTypeDisplay(): string {
    switch(this.currentUser?.userType) {
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Buyer';
      case 'distributor': return 'Distributor';
      case 'agronomist': return 'Agronomist';
      default: return 'Member';
    }
  }

  getUserTypeIcon(): string {
    switch(this.currentUser?.userType) {
      case 'farmer': return 'fas fa-tractor';
      case 'buyer': return 'fas fa-shopping-cart';
      case 'distributor': return 'fas fa-truck';
      case 'agronomist': return 'fas fa-user-md';
      default: return 'fas fa-user';
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'delivered': return 'badge-success';
      case 'processing': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-secondary';
    }
  }

  getPriorityClass(priority: string): string {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  markNotificationAsRead() {
    this.dashboardStats.notifications.unread = 0;
  }

  quickAction(action: any) {
    // Navigate to the action route
    console.log('Action:', action);
  }

  // Helper method to get color for charts
  getColor(index: number): string {
    return this.chartColors[index % this.chartColors.length];
  }

  // Helper method to calculate pie chart segment offset
  getOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.chartData.crops[i];
    }
    return offset;
  }

  // Helper method to get total crops for pie chart center
  getTotalCrops(): number {
    return this.chartData.crops.reduce((a: number, b: number) => a + b, 0);
  }

  // Clear activities timeline
  clearActivities() {
    // In a real app, you would call an API to clear activities
    console.log('Clearing activities...');
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  }

  // Calculate order total
  calculateOrderTotal(order: any): string {
    return this.formatCurrency(order.total);
  }

  // Get weather advice based on conditions
  getWeatherAdvice(): string {
    if (this.weather.rainfall === 'Low' && this.weather.temperature > 20) {
      return 'Ideal day for irrigation. Consider watering your crops.';
    } else if (this.weather.rainfall === 'High') {
      return 'Good rainfall today. No irrigation needed. Check drainage.';
    } else {
      return 'Good day for farm maintenance activities.';
    }
  }

  // Get market tip based on insights
  getMarketTip(): string {
    const bsfInsight = this.marketInsights.find(i => i.product === 'BSF Larvae');
    if (bsfInsight?.trend === 'up') {
      return 'Best time to sell BSF Larvae is Thursday-Friday when demand peaks.';
    }
    return 'Monitor market trends regularly for optimal selling times.';
  }

  // Get task count by priority
  getTaskCountByPriority(priority: string): number {
    return this.upcomingTasks.filter(task => task.priority === priority).length;
  }

  // Add a new task
  addNewTask() {
    const newTask = {
      title: 'New Task',
      date: 'Today',
      priority: 'medium',
      icon: 'fas fa-plus'
    };
    this.upcomingTasks.unshift(newTask);
  }

  // Get farmer-specific greeting
  getFarmerGreeting(): string {
    const hour = new Date().getHours();
    const baseGreeting = this.getGreeting();
    
    if (this.authService.isFarmer()) {
      if (hour >= 5 && hour < 12) {
        return `${baseGreeting}! Time for morning farm inspection.`;
      } else if (hour >= 12 && hour < 17) {
        return `${baseGreeting}! How are your crops doing today?`;
      } else {
        return `${baseGreeting}! Plan tomorrow's farm activities.`;
      }
    }
    return baseGreeting;
  }

  // Get user location summary
  getUserLocation(): string {
    if (this.currentUser?.county && this.currentUser?.subCounty) {
      return `${this.currentUser.subCounty}, ${this.currentUser.county}`;
    }
    return 'Location not set';
  }

  // Get farming experience text
  getFarmingExperience(): string {
    const experience = this.currentUser?.farmingExperience;
    if (!experience) return 'Not specified';
    
    switch(experience) {
      case '1': return 'Less than 1 year';
      case '2': return '1-2 years';
      case '5': return '3-5 years';
      case '10': return '5-10 years';
      case '20': return '10+ years';
      default: return `${experience} years`;
    }
  }

  // Check if user is verified
  isUserVerified(): boolean {
    return this.currentUser?.verified === true;
  }

  // Get next order suggestion
  getNextOrderSuggestion(): string {
    if (this.authService.isFarmer()) {
      const crops = this.currentUser?.mainCrops || [];
      if (crops.includes('Maize')) {
        return 'Consider ordering NPK fertilizer for your maize crop.';
      } else if (crops.includes('Avocado')) {
        return 'Avocado trees need calcium. Order dolomite lime.';
      }
    }
    return 'Check our latest organic products in the shop.';
  }
}