// src/app/pages/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem} from '../../services/cart';
import { MpesaService, PaymentRequest, PaymentResponse } from '../../services/mpesa';
import { TrustBadgesComponent } from '../../components/trust-badges/trust-badges';
import { SecurityFeaturesComponent } from '../../components/security-features/security-features';
import { from } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    TrustBadgesComponent,
    SecurityFeaturesComponent
  ],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  deliveryForm: FormGroup;
  
  totalAmount: number = 0;
  cartItems: CartItem[] = [];
  isLoading: boolean = false;
  paymentStatus: string = '';
  paymentError: string = '';
  
  currentStep: number = 1;
  showMpesaModal: boolean = false;
  mpesaPaymentCode: string = '';
  countdown: number = 60;
  countdownInterval: any;
  
  deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 0, days: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', price: 300, days: '1-2 business days' },
    { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Ready for pickup' }
  ];
  
  selectedDelivery: string = 'standard';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private mpesaService: MpesaService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(07\d{8}|\+2547\d{8}|2547\d{8})$/)]],
      confirmPhone: ['', [Validators.required]]
    }, { validators: this.phoneMatchValidator.bind(this) }); // ADD VALIDATOR

    this.deliveryForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(10)]],
      county: ['', [Validators.required]],
      town: ['', [Validators.required]],
      deliveryNotes: [''],
      deliveryOption: ['standard']
    });
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalPrice();
    });
    
    // Generate unique order ID
    this.generateOrderId();
  }

  generateOrderId(): void {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.mpesaPaymentCode = `MZ-${timestamp}${random}`;
  }

  // ADD THIS METHOD - Phone formatting for input
  formatPhoneInput(event: any): void {
    let value = event.target.value;
    
    // Remove any non-digits
    value = value.replace(/\D/g, '');
    
    // If starts with 0, keep it
    if (value.startsWith('0')) {
      // Already correct format
    } 
    // If starts with 7, add 0
    else if (value.startsWith('7') && value.length <= 9) {
      value = '0' + value;
    }
    // If starts with 254, convert to 0
    else if (value.startsWith('254')) {
      value = '0' + value.substring(3);
    }
    
    // Update the form control
    this.checkoutForm.patchValue({
      phoneNumber: value
    }, { emitEvent: false });
    
    // Also update confirm phone if it exists
    if (this.checkoutForm.get('confirmPhone')?.value) {
      this.checkoutForm.patchValue({
        confirmPhone: value
      }, { emitEvent: false });
    }
  }

  // ADD THIS METHOD - Phone match validator
  phoneMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const phone = group.get('phoneNumber')?.value;
    const confirmPhone = group.get('confirmPhone')?.value;
    
    if (!phone || !confirmPhone) {
      return null; // Don't validate if either is empty
    }
    
    // Format both numbers for comparison
    const formatForComparison = (num: string) => {
      if (!num) return '';
      // Remove + and spaces
      num = num.replace(/[+\s]/g, '');
      // Convert 254 to 0
      if (num.startsWith('254')) {
        num = '0' + num.substring(3);
      }
      return num;
    };
    
    return formatForComparison(phone) === formatForComparison(confirmPhone) 
      ? null 
      : { phoneMismatch: true };
  }

  // ADD THIS METHOD - Format phone for M-Pesa API
  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    let formatted = phone.trim();
    
    // Remove any non-digits
    formatted = formatted.replace(/\D/g, '');
    
    if (formatted.startsWith('0')) {
      return '254' + formatted.substring(1);
    } else if (formatted.startsWith('+254')) {
      return formatted.substring(1);
    } else if (formatted.startsWith('254')) {
      return formatted;
    } else if (formatted.startsWith('7') && formatted.length === 9) {
      return '254' + formatted;
    }
    
    return formatted; // Return as-is if pattern doesn't match
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.checkoutForm.valid) {
      this.currentStep = 2;
      window.scrollTo(0, 0);
    } else if (this.currentStep === 2 && this.deliveryForm.valid) {
      this.currentStep = 3;
      window.scrollTo(0, 0);
    }
  }

  prevStep(): void {
    this.currentStep--;
    window.scrollTo(0, 0);
  }

  selectDelivery(option: string): void {
    this.selectedDelivery = option;
    this.deliveryForm.patchValue({ deliveryOption: option });
    
    // Calculate new total with delivery
    const selectedOption = this.deliveryOptions.find(opt => opt.id === option);
    this.totalAmount = this.cartService.getTotalPrice() + (selectedOption?.price || 0);
  }

  getDeliveryPrice(): number {
    const option = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return option?.price || 0;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.deliveryForm.valid) {
      this.showMpesaModal = true;
      this.startCountdown();
    } else {
      this.markAllFormsTouched();
    }
  }

  startCountdown(): void {
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        this.paymentError = 'Payment request expired. Please try again.';
        this.showMpesaModal = false;
      }
    }, 1000);
  }

  confirmPayment(): void {
    this.isLoading = true;
    this.paymentError = '';

    const checkoutData = this.checkoutForm.value;
    const deliveryData = this.deliveryForm.value;
    const deliveryPrice = this.getDeliveryPrice();

    const paymentData: PaymentRequest = {
      phoneNumber: this.formatPhoneNumber(checkoutData.phoneNumber),
      amount: this.totalAmount,
      accountReference: this.mpesaPaymentCode,
      transactionDesc: `Mzuri Organics Order - ${this.mpesaPaymentCode}`
    };

    this.mpesaService.initiatePayment(paymentData).subscribe({
      next: (response: PaymentResponse) => {
        this.isLoading = false;
        clearInterval(this.countdownInterval);
        
        if (response.success) {
          this.paymentStatus = 'success';
          
          // Save order details
          const orderDetails = {
            orderId: this.mpesaPaymentCode,
            customer: checkoutData,
            delivery: deliveryData,
            items: this.cartItems,
            total: this.totalAmount,
            deliveryPrice: deliveryPrice,
            mpesaReference: response.checkoutRequestID,
            timestamp: new Date().toISOString()
          };
          
          localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
          
          // Clear cart
          this.cartService.clearCart();
          
          // Navigate to success page
          setTimeout(() => {
            this.router.navigate(['/order-success'], {
              queryParams: { 
                orderId: this.mpesaPaymentCode,
                reference: response.checkoutRequestID 
              }
            });
          }, 2000);
          
        } else {
          this.paymentError = response.message || 'Payment failed. Please try again.';
          this.showMpesaModal = false;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        clearInterval(this.countdownInterval);
        this.paymentError = 'Network error. Please check your connection and try again.';
        this.showMpesaModal = false;
        console.error('Payment error:', error);
      }
    });
  }

  cancelPayment(): void {
    clearInterval(this.countdownInterval);
    this.showMpesaModal = false;
    this.isLoading = false;
  }

  markAllFormsTouched(): void {
    this.markFormGroupTouched(this.checkoutForm);
    this.markFormGroupTouched(this.deliveryForm);
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get formControls() {
    return this.checkoutForm.controls;
  }

  get deliveryControls() {
    return this.deliveryForm.controls;
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}