// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Order {
  id: number;
  orderNumber: string;
  date: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  estimatedDelivery?: Date;
}

interface Message {
  id: number;
  title: string;
  content: string;
  date: Date;
  read: boolean;
  type: 'order' | 'promotion' | 'support' | 'system';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // User Info
  user = {
    name: 'David Baraza',
    email: 'david@example.com',
    phone: '+254701234567',
    address: 'Nairobi, Kenya',
    points: 1250
  };

  // Orders
  orders: Order[] = [
    {
      id: 1,
      orderNumber: 'ORD-2024-00123',
      date: new Date('2024-01-15'),
      total: 12500,
      status: 'delivered',
      items: 3,
      estimatedDelivery: new Date('2024-01-18')
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-00124',
      date: new Date('2024-01-20'),
      total: 8500,
      status: 'shipped',
      items: 2,
      estimatedDelivery: new Date('2024-01-23')
    }
  ];

  // Messages
  messages: Message[] = [
    {
      id: 1,
      title: 'Order Shipped!',
      content: 'Your order ORD-2024-00124 has been shipped and is on its way.',
      date: new Date('2024-01-21'),
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'New Product Alert',
      content: 'Check out our new organic fertilizers now available!',
      date: new Date('2024-01-18'),
      read: true,
      type: 'promotion'
    }
  ];

  // Stats
  stats = {
    totalOrders: 12,
    totalSpent: 85400,
    loyaltyPoints: 1250,
    pendingOrders: 1
  };

  // Active Tab
  activeTab: 'overview' | 'orders' | 'messages' | 'profile' = 'overview';

  ngOnInit() {
    // Load user data and orders from backend
  }

  getStatusClass(status: string): string {
    const classes = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return classes[status as keyof typeof classes] || 'status-pending';
  }

  getStatusText(status: string): string {
    const texts = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return texts[status as keyof typeof texts] || 'Pending';
  }

  getMessageIcon(type: string): string {
    const icons = {
      order: 'fas fa-box',
      promotion: 'fas fa-bullhorn',
      support: 'fas fa-headset',
      system: 'fas fa-cog'
    };
    return icons[type as keyof typeof icons] || 'fas fa-envelope';
  }

  markAsRead(messageId: number) {
    const message = this.messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
    }
  }

  deleteMessage(messageId: number) {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }

  getUnreadCount(): number {
    return this.messages.filter(m => !m.read).length;
  }

  getRecentOrders(count: number = 3): Order[] {
    return this.orders
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, count);
  }

  trackOrder(orderNumber: string) {
    // Navigate to order tracking page
    console.log('Tracking order:', orderNumber);
  }

  updateProfile() {
    // Update profile logic
    alert('Profile updated successfully!');
  }

  // FIX: Use a proper function instead of inline arrow function in template
  markAllMessagesAsRead() {
    this.messages.forEach(message => {
      message.read = true;
    });
  }
}