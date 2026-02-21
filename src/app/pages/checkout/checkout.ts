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
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  cartItems: any[] = [];
  totalAmount: number = 0;
  subtotal: number = 0;
  orderCode: string = '';
  
  deliveryOptions = [
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      days: '2-3 business days', 
      price: 0
    },
    { 
      id: 'express', 
      name: 'Express Delivery', 
      days: '24 hours', 
      price: 0
    },
    { 
      id: 'pickup', 
      name: 'Store Pickup', 
      days: 'Ready in 2 hours', 
      price: 0 
    }
  ];
  
  selectedDelivery: string = 'standard';
  checkoutForm!: FormGroup;
  deliveryForm!: FormGroup;
  showConfirmationModal: boolean = false;
  isLoading: boolean = false;
  
  // WhatsApp configuration - FIXED: No spaces
  readonly WHATSAPP_NUMBER: string = '254701934918';
  readonly DISPLAY_PHONE_NUMBER: string = '+254 701 934918';
  readonly TILL_NUMBER: string = '8589836';
  readonly BUSINESS_NAME: string = 'Mzuri Organics';

  // County properties
  counties: string[] = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kiambu', 'Machakos', 'Kajiado', 'Muranga', 'Nyeri', 'Meru',
    'Embu', 'Kirinyaga', 'Laikipia', 'Nyandarua', 'Baringo',
    'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Garissa', 'Homa Bay',
    'Isiolo', 'Kakamega', 'Kericho', 'Kilifi', 'Kisii',
    'Kitui', 'Kwale', 'Lamu', 'Mandera',
    'Marsabit', 'Migori', 'Nandi', 'Narok', 'Nyamira', 'Samburu',
    'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ].sort();

  countyInputMode: 'select' | 'manual' = 'select';
  countySuggestions: string[] = [];

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

  ngOnDestroy(): void {}

  private initializeForms(): void {
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

    this.deliveryForm = this.fb.group({
      county: ['', Validators.required],
      countyManual: ['', [
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
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

    // Listen to county manual input changes for suggestions
    this.deliveryForm.get('countyManual')?.valueChanges.subscribe(value => {
      this.filterCountySuggestions(value);
    });

    // Initialize county mode
    this.setCountyInputMode('select');
  }

  get formControls() {
    return this.checkoutForm.controls;
  }

  get deliveryControls() {
    return this.deliveryForm.controls;
  }

  phoneMatchValidator(group: AbstractControl): ValidationErrors | null {
    const phone = group.get('phoneNumber')?.value;
    const confirmPhone = group.get('confirmPhone')?.value;
    
    if (phone && confirmPhone && phone !== confirmPhone) {
      return { phoneMismatch: true };
    }
    return null;
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotal();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      if (this.toastService) {
        this.toastService.showWarning('Your cart is empty. Please add items before checkout.');
      }
    }
  }

  calculateTotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const delivery = this.getDeliveryPrice();
    this.totalAmount = this.subtotal + delivery;
  }

  getDeliveryPrice(): number {
    if (this.subtotal >= 2000 && this.selectedDelivery === 'standard') {
      return 0;
    }
    
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.price : 0;
  }

  getSelectedDeliveryName(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.name : 'Standard Delivery';
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      if (this.currentStep === 1 && this.checkoutForm.invalid) {
        this.markFormGroupTouched(this.checkoutForm);
        if (this.toastService) {
          this.toastService.showError('Please fill in all required customer details correctly.');
        }
        return;
      }
      
      if (this.currentStep === 2) {
        // Check county validation based on mode
        let countyValid = false;
        
        if (this.countyInputMode === 'select') {
          countyValid = this.deliveryForm.get('county')?.valid || false;
        } else {
          countyValid = this.deliveryForm.get('countyManual')?.valid || false;
        }
        
        const otherFieldsValid = 
          this.deliveryForm.get('town')?.valid && 
          this.deliveryForm.get('address')?.valid;
        
        if (!countyValid || !otherFieldsValid) {
          this.markFormGroupTouched(this.deliveryForm);
          if (this.toastService) {
            this.toastService.showError('Please fill in all required delivery information.');
          }
          return;
        }
      }
      
      this.currentStep++;
      
      if (this.currentStep === 3) {
        this.generateOrderCode();
        this.calculateTotal();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectDelivery(methodId: string): void {
    this.selectedDelivery = methodId;
    this.calculateTotal();
  }

  generateOrderCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderCode = `MZ${timestamp}${random}`;
    return this.orderCode;
  }

  getWhatsAppContactLink(): string {
    return `https://wa.me/${this.WHATSAPP_NUMBER}`;
  }

  getItemSummary(): string {
    return this.cartItems
      .map(item => `${item.quantity}x ${item.name} (KES ${item.price * item.quantity})`)
      .join(', ');
  }

  generateWhatsAppMessage(): string {
    const customer = this.checkoutForm.value;
    const delivery = this.deliveryForm.value;
    
    // Get county based on input mode
    let county = '';
    if (this.countyInputMode === 'select') {
      const selectedCounty = this.counties.find(c => c.toLowerCase() === delivery.county);
      county = selectedCounty || delivery.county || '';
    } else {
      county = delivery.countyManual || '';
    }
    
    const message = `
*MZURI ORGANICS - ORDER CONFIRMATION*

📋 *Order #:* ${this.orderCode}
👤 *Customer:* ${customer.firstName} ${customer.lastName}
📱 *Phone:* ${customer.phoneNumber}
📧 *Email:* ${customer.email}

📍 *Delivery Address:*
${delivery.town}, ${county}
${delivery.address}
${delivery.deliveryNotes ? `📝 *Notes:* ${delivery.deliveryNotes}` : ''}

🛒 *Items Ordered:*
${this.cartItems.map(item => `• ${item.quantity}x ${item.name} - KES ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

💰 *Payment Summary:*
Subtotal: KES ${(this.totalAmount - this.getDeliveryPrice()).toLocaleString()}
Delivery: ${this.getDeliveryPrice() === 0 ? 'FREE' : `KES ${this.getDeliveryPrice().toLocaleString()}`}
*Total: KES ${this.totalAmount.toLocaleString()}*

💳 *Payment Method:* M-Pesa Till ${this.TILL_NUMBER}

*I have made the payment and attached my M-Pesa confirmation screenshot.*

Thank you for choosing Mzuri Organics! We appreciate your business
    `.trim();
    
    return encodeURIComponent(message);
  }

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

  proceedToPaymentConfirmation(): void {
    if (this.checkoutForm.invalid || this.deliveryForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.markFormGroupTouched(this.deliveryForm);
      if (this.toastService) {
        this.toastService.showError('Please complete all required information');
      }
      return;
    }

    if (this.cartItems.length === 0) {
      if (this.toastService) {
        this.toastService.showError('Your cart is empty');
      }
      this.router.navigate(['/cart']);
      return;
    }

    this.saveOrderToStorage();
  }

  saveOrderToStorage(): void {
    this.isLoading = true;
    
    // Get county based on input mode
    let countyValue = '';
    if (this.countyInputMode === 'select') {
      const selectedCounty = this.counties.find(c => c.toLowerCase() === this.deliveryForm.value.county);
      countyValue = selectedCounty || this.deliveryForm.value.county || '';
    } else {
      countyValue = this.deliveryForm.value.countyManual || '';
    }
    
    const orderData = {
      customer: {
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phoneNumber: this.checkoutForm.value.phoneNumber
      },
      delivery: {
        county: countyValue,
        town: this.deliveryForm.value.town,
        address: this.deliveryForm.value.address,
        deliveryNotes: this.deliveryForm.value.deliveryNotes || '',
        method: this.getSelectedDeliveryName(),
        cost: this.getDeliveryPrice(),
        selectedOption: this.selectedDelivery,
        inputMode: this.countyInputMode
      },
      items: this.cartItems,
      total: this.totalAmount,
      subtotal: this.totalAmount - this.getDeliveryPrice(),
      deliveryCost: this.getDeliveryPrice()
    };

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

  closeConfirmationModal(): void {
    this.showConfirmationModal = false;
    this.isLoading = false;
    
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }

  viewOrderSummary(): void {
    this.showConfirmationModal = false;
    sessionStorage.setItem('current_order', this.orderCode);
    
    if (this.toastService) {
      this.toastService.showInfo(`Order #${this.orderCode} details saved`);
    }
  }

  sendOrderEmail(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
      if (this.toastService) {
        this.toastService.showSuccess('Order summary sent to your email!');
      }
    }, 1500);
  }

  formatPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.startsWith('0')) {
      value = value.substring(1);
    }
    
    if (value.length > 0 && !value.startsWith('7')) {
      value = '7' + value;
    }
    
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    this.checkoutForm.patchValue({ phoneNumber: value });
    
    const confirmPhone = this.checkoutForm.get('confirmPhone')?.value;
    if (confirmPhone === event.target.value) {
      this.checkoutForm.patchValue({ confirmPhone: value });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  formatCurrency(amount: number): string {
    return 'KES ' + amount.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  formatNumber(amount: number): string {
    return amount.toLocaleString('en-KE');
  }

  isFreeDelivery(): boolean {
    return this.subtotal >= 2000 && this.selectedDelivery === 'standard';
  }

  getDeliveryTime(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.days : '2-3 business days';
  }

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

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotal();
  }

  resetCheckout(): void {
    this.currentStep = 1;
    this.checkoutForm.reset();
    this.deliveryForm.reset();
    this.selectedDelivery = 'standard';
    this.countyInputMode = 'select';
    this.countySuggestions = [];
    this.generateOrderCode();
    if (this.toastService) {
      this.toastService.showInfo('Checkout form has been reset');
    }
  }

  // County Input Mode Methods
  setCountyInputMode(mode: 'select' | 'manual'): void {
    this.countyInputMode = mode;
    
    // Clear suggestions when switching modes
    this.countySuggestions = [];
    
    // Update validation based on mode
    if (mode === 'select') {
      this.deliveryForm.get('county')?.setValidators([Validators.required]);
      this.deliveryForm.get('countyManual')?.clearValidators();
      this.deliveryForm.get('countyManual')?.setValue('');
    } else {
      this.deliveryForm.get('countyManual')?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]);
      this.deliveryForm.get('county')?.clearValidators();
      this.deliveryForm.get('county')?.setValue('');
    }
    
    // Update validation status
    this.deliveryForm.get('county')?.updateValueAndValidity();
    this.deliveryForm.get('countyManual')?.updateValueAndValidity();
  }

  filterCountySuggestions(searchTerm: string): void {
    if (!searchTerm || searchTerm.length < 2) {
      this.countySuggestions = [];
      return;
    }
    
    const term = searchTerm.toLowerCase();
    this.countySuggestions = this.counties.filter(county => 
      county.toLowerCase().includes(term)
    ).slice(0, 5); // Limit to 5 suggestions
  }

  selectCountySuggestion(county: string): void {
    this.deliveryForm.get('countyManual')?.setValue(county);
    this.countySuggestions = [];
  }

  onCountyChange(): void {
    this.deliveryForm.patchValue({ town: '' });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  getOrderSummary(): any {
    // Get county based on input mode
    let countyValue = '';
    if (this.countyInputMode === 'select') {
      const selectedCounty = this.counties.find(c => c.toLowerCase() === this.deliveryForm.value.county);
      countyValue = selectedCounty || this.deliveryForm.value.county || '';
    } else {
      countyValue = this.deliveryForm.value.countyManual || '';
    }
    
    return {
      orderNumber: this.orderCode,
      items: this.cartItems,
      subtotal: this.subtotal,
      delivery: this.getDeliveryPrice(),
      total: this.totalAmount,
      customer: this.checkoutForm.value,
      deliveryInfo: {
        ...this.deliveryForm.value,
        county: countyValue
      }
    };
  }
}