// src/app/pages/order-success/order-success.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges'; // ADD THIS IMPORT

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule, TrustBadgesComponent], // ADD TrustBadgesComponent HERE
  templateUrl: './order-success.html',
  styleUrls: ['./order-success.css']
})
export class OrderSuccessComponent implements OnInit {
  orderId: string = '';
  mpesaReference: string = '';
  orderDetails: any = null;
  estimatedDelivery: string = '';
  today: Date = new Date(); // ADD THIS PROPERTY

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.today = new Date(); // Initialize date
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || 'N/A';
      this.mpesaReference = params['reference'] || 'N/A';
      
      // Load order details from localStorage
      const savedOrder = localStorage.getItem('currentOrder');
      if (savedOrder) {
        this.orderDetails = JSON.parse(savedOrder);
        
        // Calculate estimated delivery
        this.calculateDelivery();
        
        // Clear cart if not already cleared
        this.cartService.clearCart();
        
        // Send order confirmation (simulated)
        this.sendOrderConfirmation();
      }
    });
  }

  calculateDelivery(): void {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    // Add 3-5 business days for standard delivery
    const daysToAdd = 3 + Math.floor(Math.random() * 3);
    deliveryDate.setDate(today.getDate() + daysToAdd);
    
    // Format date
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    this.estimatedDelivery = deliveryDate.toLocaleDateString('en-KE', options);
  }

  sendOrderConfirmation(): void {
    // In a real app, this would send an email/SMS
    console.log('Order confirmation sent for:', this.orderId);
    
    // Simulate sending order details to backend
    setTimeout(() => {
      // Clear order from localStorage after some time
      localStorage.removeItem('currentOrder');
    }, 5000);
  }

  printReceipt(): void {
    window.print();
  }

  trackOrder(): void {
    // Navigate to order tracking page
    this.router.navigate(['/track-order', this.orderId]);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}