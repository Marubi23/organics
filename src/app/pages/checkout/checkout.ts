// checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DecimalPipe, DatePipe],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  // Checkout Steps
  currentStep: 'cart' | 'details' | 'payment' | 'confirmation' = 'cart';
  
  // Cart Info
  cartItems: any[] = [];
  cartTotal = 0;
  
  // Customer Details
  customer = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  };
  
  // Payment Info
  paymentMethod: 'mpesa' | 'cash' = 'mpesa';
  mpesaNumber = '';
  showPaymentModal = false;
  
  // Loading States
  processingPayment = false;
  paymentSuccessful = false;
  
  // Today's date for confirmation
  today = new Date();
  
  // For template Math functions
  Math = Math;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadCart();
  }
  
  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getTotalPrice();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/products']);
    }
  }
  
  goToStep(step: 'cart' | 'details' | 'payment' | 'confirmation') {
    this.currentStep = step;
  }
  
  nextStep() {
    if (this.currentStep === 'cart') {
      this.currentStep = 'details';
    } else if (this.currentStep === 'details') {
      if (this.validateDetails()) {
        this.currentStep = 'payment';
      }
    } else if (this.currentStep === 'payment') {
      this.initiatePayment();
    }
  }
  
  previousStep() {
    if (this.currentStep === 'details') {
      this.currentStep = 'cart';
    } else if (this.currentStep === 'payment') {
      this.currentStep = 'details';
    }
  }
  
  validateDetails(): boolean {
    const { name, phone, address, city } = this.customer;
    return !!(name && phone && address && city);
  }
  
  initiatePayment() {
    if (this.paymentMethod === 'mpesa') {
      this.showPaymentModal = true;
    } else if (this.paymentMethod === 'cash') {
      this.processCashPayment();
    }
  }
  
  processMpesaPayment() {
    if (!this.mpesaNumber) {
      alert('Please enter your M-Pesa number');
      return;
    }
    
    this.processingPayment = true;
    
    // Simulate M-Pesa API call
    setTimeout(() => {
      this.processingPayment = false;
      this.paymentSuccessful = true;
      this.cartService.clearCart();
      this.currentStep = 'confirmation';
    }, 3000);
  }
  
  processCashPayment() {
    this.paymentSuccessful = true;
    this.cartService.clearCart();
    this.currentStep = 'confirmation';
  }
  
  continueShopping() {
    this.router.navigate(['/products']);
  }
}