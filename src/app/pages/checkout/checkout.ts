// src/app/pages/checkout/checkout.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService, CreateOrderResponse } from '../../services/order';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-checkout',
  standalone: true, // <-- Add this for standalone component
  imports: [CommonModule, ReactiveFormsModule], // <-- Add this for imports
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  // Current step in checkout process (1, 2, or 3)
  currentStep: number = 1;
  
  // Cart items from cart service
  cartItems: any[] = [];
  
  // Total amount to be paid
  totalAmount: number = 0;
  subtotal: number = 0;
  
  // Order code for tracking
  orderCode: string = '';
  
  // Delivery options
  deliveryOptions = [
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      days: '2-3 business days', 
      price: 200 
    },
    { 
      id: 'express', 
      name: 'Express Delivery', 
      days: '24 hours', 
      price: 500 
    },
    { 
      id: 'pickup', 
      name: 'Store Pickup', 
      days: 'Ready in 2 hours', 
      price: 0 
    }
  ];
  
  // Selected delivery option
  selectedDelivery: string = 'standard';
  
  // Form groups for checkout steps
  checkoutForm!: FormGroup;
  deliveryForm!: FormGroup;
  
  // Modal state
  showConfirmationModal: boolean = false;
  isLoading: boolean = false;
  
  // WhatsApp configuration - UPDATE THESE VALUES
  readonly WHATSAPP_NUMBER: string = '+254 701 934918'; // Replace with your WhatsApp number
  readonly TILL_NUMBER: string = '8589836';
  readonly BUSINESS_NAME: string = 'Mzuri Organics';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {
    this.orderCode = this.generateOrderCode();
  }

  ngOnInit(): void {
    this.initializeForms();
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Initialize all form groups with validators
   */
  private initializeForms(): void {
    // Step 1: Customer Details Form
    this.checkoutForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^(07|7|01)\d{8}$/)
      ]],
      confirmPhone: ['', Validators.required]
    }, { 
      validators: this.phoneMatchValidator 
    });

    // Step 2: Delivery Form
    this.deliveryForm = this.fb.group({
      county: ['', Validators.required],
      town: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      address: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      deliveryNotes: ['']
    });
  }

  /**
   * Getter for easy access to form controls in template
   */
  get formControls() {
    return this.checkoutForm.controls;
  }

  get deliveryControls() {
    return this.deliveryForm.controls;
  }

  /**
   * Custom validator to check if phone numbers match
   */
  phoneMatchValidator(group: AbstractControl): ValidationErrors | null {
    const phone = group.get('phoneNumber')?.value;
    const confirmPhone = group.get('confirmPhone')?.value;
    
    if (phone && confirmPhone && phone !== confirmPhone) {
      return { phoneMismatch: true };
    }
    return null;
  }

  /**
   * Load cart items from cart service
   */
  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    
    // If cart is empty, redirect to cart page
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      // Only show warning if we have toast service
      if (this.toastService) {
        this.toastService.showWarning('Your cart is empty. Please add items before checkout.');
      }
    }
  }

  /**
   * Calculate total amount including delivery
   */
  calculateTotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const delivery = this.getDeliveryPrice();
    this.totalAmount = this.subtotal + delivery;
  }

  /**
   * Get delivery price based on selected option
   */
  getDeliveryPrice(): number {
    // Apply free delivery if subtotal >= 2000
    if (this.subtotal >= 2000 && this.selectedDelivery === 'standard') {
      return 0;
    }
    
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.price : 0;
  }

  /**
   * Get selected delivery method name
   */
  getSelectedDeliveryName(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.name : 'Standard Delivery';
  }

  /**
   * Navigate to next step
   */
  nextStep(): void {
    if (this.currentStep < 3) {
      // Validate current step before proceeding
      if (this.currentStep === 1 && this.checkoutForm.invalid) {
        this.markFormGroupTouched(this.checkoutForm);
        if (this.toastService) {
          this.toastService.showError('Please fill in all required customer details correctly.');
        }
        return;
      }
      
      if (this.currentStep === 2 && this.deliveryForm.invalid) {
        this.markFormGroupTouched(this.deliveryForm);
        if (this.toastService) {
          this.toastService.showError('Please fill in all required delivery information.');
        }
        return;
      }
      
      this.currentStep++;
      
      // If moving to step 3, ensure order code is generated
      if (this.currentStep === 3) {
        this.generateOrderCode();
        this.calculateTotal(); // Recalculate in case delivery changed
      }
    }
  }

  /**
   * Navigate to previous step
   */
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Select delivery option
   */
  selectDelivery(methodId: string): void {
    this.selectedDelivery = methodId;
    this.calculateTotal();
  }

  /**
   * Generate unique order code
   */
  generateOrderCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderCode = `MZ${timestamp}${random}`;
    return this.orderCode;
  }

  /**
   * Get WhatsApp contact link
   */
  getWhatsAppContactLink(): string {
    return `https://wa.me/${this.WHATSAPP_NUMBER}`;
  }

  /**
   * Get item summary for WhatsApp message
   */
  getItemSummary(): string {
    return this.cartItems
      .map(item => `${item.quantity}x ${item.name} (KES ${item.price * item.quantity})`)
      .join(', ');
  }

  /**
   * Generate WhatsApp message with order details
   */
  generateWhatsAppMessage(): string {
    const customer = this.checkoutForm.value;
    const delivery = this.deliveryForm.value;
    
    const message = `
*MZURI ORGANICS - ORDER CONFIRMATION*

📋 *Order #:* ${this.orderCode}
👤 *Customer:* ${customer.firstName} ${customer.lastName}
📱 *Phone:* ${customer.phoneNumber}
📧 *Email:* ${customer.email}

📍 *Delivery Address:*
${delivery.town}, ${delivery.county}
${delivery.address}
${delivery.deliveryNotes ? `📝 *Notes:* ${delivery.deliveryNotes}` : ''}

🛒 *Items Ordered:*
${this.cartItems.map(item => `• ${item.quantity}x ${item.name} - KES ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

💰 *Payment Summary:*
Subtotal: KES ${(this.totalAmount - this.getDeliveryPrice()).toLocaleString()}
Delivery: ${this.getDeliveryPrice() === 0 ? 'FREE' : `KES ${this.getDeliveryPrice().toLocaleString()}`}
*Total: KES ${this.totalAmount.toLocaleString()}*

💳 *Payment Method:* M-Pesa Till ${this.TILL_NUMBER}

✅ *I have made the payment and attached my M-Pesa confirmation screenshot.*

Thank you for choosing Mzuri Organics! 🌿
    `.trim();
    
    return encodeURIComponent(message);
  }

  /**
   * Open WhatsApp with pre-filled message
   */
  openWhatsAppWithMessage(): void {
    if (!this.checkoutForm.valid || !this.deliveryForm.valid) {
      if (this.toastService) {
        this.toastService.showError('Please complete all checkout steps first.');
      }
      return;
    }
    
    const message = this.generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      if (this.toastService) {
        this.toastService.showSuccess('Copied to clipboard!');
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
      if (this.toastService) {
        this.toastService.showError('Failed to copy to clipboard');
      }
    });
  }

  /**
   * Proceed to payment confirmation
   */
  proceedToPaymentConfirmation(): void {
    // Validate all forms
    if (this.checkoutForm.invalid || this.deliveryForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.markFormGroupTouched(this.deliveryForm);
      if (this.toastService) {
        this.toastService.showError('Please complete all required information');
      }
      return;
    }

    // Check if cart is empty
    if (this.cartItems.length === 0) {
      if (this.toastService) {
        this.toastService.showError('Your cart is empty');
      }
      this.router.navigate(['/cart']);
      return;
    }

    // Save order to storage
    this.saveOrderToStorage();
  }

  /**
   * Save order to localStorage and backend
   */
  saveOrderToStorage(): void {
    this.isLoading = true;
    
    const orderData = {
      customer: {
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phoneNumber: this.checkoutForm.value.phoneNumber
      },
      delivery: {
        county: this.deliveryForm.value.county,
        town: this.deliveryForm.value.town,
        address: this.deliveryForm.value.address,
        deliveryNotes: this.deliveryForm.value.deliveryNotes || '',
        method: this.getSelectedDeliveryName(),
        cost: this.getDeliveryPrice(),
        selectedOption: this.selectedDelivery
      },
      items: this.cartItems,
      total: this.totalAmount,
      subtotal: this.totalAmount - this.getDeliveryPrice(),
      deliveryCost: this.getDeliveryPrice()
    };

    // Create order using OrderService
    if (this.orderService) {
      this.orderService.createOrder(orderData).subscribe({
        next: (response: CreateOrderResponse) => {
          this.isLoading = false;
          
          if (response.success && response.orderId) {
            this.orderCode = response.orderId;
            if (this.toastService) {
              this.toastService.showSuccess('Order created successfully!');
            }
            this.showConfirmationModal = true;
            
            // Scroll to top of modal
            setTimeout(() => {
              const modalContent = document.querySelector('.modal-content');
              if (modalContent) {
                modalContent.scrollTop = 0;
              }
            }, 100);
          } else {
            if (this.toastService) {
              this.toastService.showError(response.error || 'Failed to create order');
            }
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Error creating order:', error);
          if (this.toastService) {
            this.toastService.showError('An error occurred while creating your order');
          }
        }
      });
    } else {
      // Fallback: Save to localStorage directly
      this.isLoading = false;
      const order = {
        id: this.orderCode,
        customer: orderData.customer,
        delivery: orderData.delivery,
        items: orderData.items,
        total: orderData.total,
        subtotal: orderData.subtotal,
        deliveryCost: orderData.deliveryCost,
        status: 'pending_payment',
        paymentMethod: 'mpesa_till',
        tillNumber: this.TILL_NUMBER,
        whatsappNumber: this.WHATSAPP_NUMBER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`order_${this.orderCode}`, JSON.stringify(order));
      this.showConfirmationModal = true;
    }
  }

  /**
   * Close confirmation modal
   */
  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.isLoading = false;
    
    // Optionally redirect to home after a delay
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }

  /**
   * View order summary details
   */
  viewOrderSummary(): void {
    this.showConfirmationModal = false;
    
    // Save order to session for viewing
    sessionStorage.setItem('current_order', this.orderCode);
    
    // You can navigate to an order details page or show in modal
    if (this.toastService) {
      this.toastService.showInfo(`Order #${this.orderCode} details saved`);
    }
  }

  /**
   * Send order email confirmation
   */
  sendOrderEmail(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      if (this.toastService) {
        this.toastService.showSuccess('Order summary sent to your email!');
      }
    }, 1500);
  }

  /**
   * Format phone input (remove non-digits, handle leading 0)
   */
  formatPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    // Remove leading 0 if present
    if (value.startsWith('0')) {
      value = value.substring(1);
    }
    
    // Ensure it starts with 7 for Kenya mobile
    if (value.length > 0 && !value.startsWith('7')) {
      value = '7' + value;
    }
    
    // Limit to 9 digits (Kenya mobile without country code)
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    this.checkoutForm.patchValue({ phoneNumber: value });
    
    // Also update confirm phone if it matches the old value
    const confirmPhone = this.checkoutForm.get('confirmPhone')?.value;
    if (confirmPhone === event.target.value) {
      this.checkoutForm.patchValue({ confirmPhone: value });
    }
  }

  /**
   * Mark all form controls as touched to trigger validation
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Format currency display (using toLocaleString instead of pipe)
   */
  formatCurrency(amount: number): string {
    return 'KES ' + amount.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  /**
   * Format number for display (using toLocaleString instead of pipe)
   */
  formatNumber(amount: number): string {
    return amount.toLocaleString('en-KE');
  }

  /**
   * Check if free delivery applies
   */
  isFreeDelivery(): boolean {
    return this.subtotal >= 2000 && this.selectedDelivery === 'standard';
  }

  /**
   * Get delivery time estimate
   */
  getDeliveryTime(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.days : '2-3 business days';
  }

  /**
   * Confirm payment was made
   */
  confirmPaymentMade(): void {
    this.isLoading = true;
    
    if (this.orderService) {
      this.orderService.confirmPayment(this.orderCode, {
        amount: this.totalAmount,
        phoneNumber: this.checkoutForm.value.phoneNumber
      }).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            if (this.toastService) {
              this.toastService.showSuccess('Payment confirmed! Your order is now being processed.');
            }
            this.closeConfirmationModal();
          } else {
            if (this.toastService) {
              this.toastService.showError('Failed to confirm payment. Please contact support.');
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error confirming payment:', error);
          if (this.toastService) {
            this.toastService.showError('An error occurred while confirming payment');
          }
        }
      });
    } else {
      this.isLoading = false;
      this.closeConfirmationModal();
    }
  }

  /**
   * Get cart item count
   */
  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Clear cart after successful order
   */
  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotal();
  }

  /**
   * Reset checkout process (for testing)
   */
  resetCheckout(): void {
    this.currentStep = 1;
    this.checkoutForm.reset();
    this.deliveryForm.reset();
    this.selectedDelivery = 'standard';
    this.generateOrderCode();
    if (this.toastService) {
      this.toastService.showInfo('Checkout form has been reset');
    }
  }

  /**
   * Get counties list for Kenya
   */
  getCounties(): string[] {
    return [
      'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
      'Kiambu', 'Machakos', 'Kajiado', 'Muranga', 'Nyeri', 'Meru',
      'Embu', 'Kirinyaga', 'Laikipia', 'Nyandarua', 'Nakuru', 'Baringo',
      'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Garissa', 'Homa Bay',
      'Isiolo', 'Kakamega', 'Kericho', 'Kilifi', 'Kirinyaga', 'Kisii',
      'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Mandera',
      'Marsabit', 'Migori', 'Mombasa', 'Muranga', 'Nairobi', 'Nakuru',
      'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
      'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
      'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ].sort();
  }

  /**
   * Update towns when county changes
   */
  onCountyChange(): void {
    this.deliveryForm.patchValue({ town: '' });
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Get order summary for display
   */
  getOrderSummary(): any {
    return {
      orderNumber: this.orderCode,
      items: this.cartItems,
      subtotal: this.subtotal,
      delivery: this.getDeliveryPrice(),
      total: this.totalAmount,
      customer: this.checkoutForm.value,
      deliveryInfo: this.deliveryForm.value
    };
  }
}