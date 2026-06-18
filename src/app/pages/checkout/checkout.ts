import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartComponent } from '../cart/cart';
import { OrderService, CreateOrderResponse } from '../../services/order';
import { ToastService } from '../../services/toast';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CartComponent],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  cartItems: any[] = [];
  totalAmount: number = 0;
  subtotal: number = 0;
  orderCode: string = '';
  
  // ===== COLLAPSIBLE STATE =====
  addressSectionOpen: boolean = true;  // Start open since it's required
  instructionsSectionOpen: boolean = false;
  
  // Updated delivery options with WhatsApp notes
  deliveryOptions = [
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      days: '2-3 business days', 
      price: 0,
      note: 'Cost to be confirmed on WhatsApp based on distance'
    },
    { 
      id: 'express', 
      name: 'Express Delivery', 
      days: '24 hours', 
      price: 0,
      note: 'Cost to be confirmed on WhatsApp based on distance'
    },
    { 
      id: 'pickup', 
      name: 'Store Pickup', 
      days: 'Ready in 2 hours', 
      price: 0,
      note: 'Free pickup at our location'
    }
  ];
  
  selectedDelivery: string = 'standard';
  checkoutForm!: FormGroup;
  deliveryForm!: FormGroup;
  showConfirmationModal: boolean = false;
  isLoading: boolean = false;
  
  // WhatsApp configuration
  readonly WHATSAPP_NUMBER: string = '254701934918';
  readonly DISPLAY_PHONE_NUMBER: string = '+254 701 934918';
  readonly TILL_NUMBER: string = '8589836';
  readonly BUSINESS_NAME: string = 'Mzuri Organics';
  readonly FREE_DELIVERY_THRESHOLD: number = 25000;

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
        Validators.pattern(/^(0?7|0?1)\d{8}$/)
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
    this.calculateSubtotal();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      if (this.toastService) {
        this.toastService.showWarning('Your cart is empty. Please add items before checkout.');
      }
    }
  }

  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    this.totalAmount = this.subtotal;
  }

  getDeliveryPrice(): number {
    return 0;
  }

  getSelectedDeliveryName(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.name : 'Standard Delivery';
  }

  getSelectedDeliveryNote(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.note : '';
  }

  isFreeDeliveryEligible(): boolean {
    return this.subtotal >= this.FREE_DELIVERY_THRESHOLD;
  }

  getCountyValue(): string {
    if (this.countyInputMode === 'select') {
      const selectedCounty = this.counties.find(c => c.toLowerCase() === this.deliveryForm.value.county);
      return selectedCounty || this.deliveryForm.value.county || '';
    } else {
      return this.deliveryForm.value.countyManual || '';
    }
  }

  // ===== COLLAPSIBLE METHODS =====
  toggleAddressSection(): void {
    this.addressSectionOpen = !this.addressSectionOpen;
  }

  toggleInstructionsSection(): void {
    this.instructionsSectionOpen = !this.instructionsSectionOpen;
  }

  isAddressSectionFilled(): boolean {
    const county = this.getCountyValue();
    const town = this.deliveryForm.get('town')?.value;
    const address = this.deliveryForm.get('address')?.value;
    return !!(county && town && address);
  }

  isInstructionsFilled(): boolean {
    const notes = this.deliveryForm.get('deliveryNotes')?.value;
    return !!(notes && notes.trim().length > 0);
  }

  // Updated: Only check address section fields
  isDeliveryFormValid(): boolean {
    const county = this.getCountyValue();
    const town = this.deliveryForm.get('town')?.value;
    const address = this.deliveryForm.get('address')?.value;
    return !!(county && town && address);
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
        if (!this.isDeliveryFormValid()) {
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
        this.calculateSubtotal();
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
    if (this.cartItems.length > 3) {
      const firstFew = this.cartItems.slice(0, 3).map(item => `${item.quantity}x ${item.name}`).join(', ');
      return `${firstFew} + ${this.cartItems.length - 3} more items`;
    }
    return this.cartItems
      .map(item => `${item.quantity}x ${item.name}`)
      .join(', ');
  }

  // Format phone number for display (with leading 0)
  formatPhoneForDisplay(phone: string): string {
    if (!phone) return '';
    if (phone.match(/^[71]/)) {
      return '0' + phone;
    }
    return phone;
  }

  // Format phone number for storage (without leading 0)
  formatPhoneForStorage(phone: string): string {
    if (!phone) return '';
    return phone.replace(/^0/, '');
  }

  // Generate WhatsApp message
  generateWhatsAppMessage(): string {
    const customer = this.checkoutForm.value;
    const delivery = this.deliveryForm.value;
    
    const county = this.getCountyValue();
    const displayPhone = this.formatPhoneForDisplay(customer.phoneNumber);
    
    const freeDeliveryNote = this.isFreeDeliveryEligible() 
      ? '✅ ELIGIBLE FOR FREE DELIVERY (order above KES 25,000)' 
      : '💰 Please assess distance and confirm delivery cost';
    
    const message = `
*MZURI ORGANICS - NEW ORDER REQUEST*

📋 *ORDER #:* ${this.orderCode}
📅 *Date:* ${new Date().toLocaleDateString()}

👤 *CUSTOMER DETAILS*
Name: ${customer.firstName} ${customer.lastName}
Phone: ${displayPhone}
Email: ${customer.email}

📍 *DELIVERY ADDRESS*
Town/City: ${delivery.town}
County: ${county}
Address: ${delivery.address}
${delivery.deliveryNotes ? `Notes: ${delivery.deliveryNotes}` : ''}

🚚 *DELIVERY METHOD*
Method: ${this.getSelectedDeliveryName()}
${freeDeliveryNote}

🛒 *ITEMS ORDERED*
${this.cartItems.map(item => `• ${item.quantity}x ${item.name} - KES ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

💰 *PAYMENT SUMMARY*
Subtotal: KES ${this.subtotal.toLocaleString()}
----------------------------------------
*AMOUNT PAID: KES ${this.subtotal.toLocaleString()}*
(Payment via M-Pesa Till ${this.TILL_NUMBER})

⚠️ *IMPORTANT NOTES:*
1. Please assess distance and confirm delivery cost
2. Customer will be contacted via WhatsApp for delivery arrangements
3. M-Pesa confirmation screenshot attached

*I have made the payment and attached my M-Pesa confirmation screenshot.*

Thank you for choosing Mzuri Organics! 🌱
    `.trim();
    
    return encodeURIComponent(message);
  }

  openWhatsAppWithMessage(): void {
    if (!this.checkoutForm.valid || !this.isDeliveryFormValid()) {
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
    if (this.checkoutForm.invalid || !this.isDeliveryFormValid()) {
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
    
    const countyValue = this.getCountyValue();
    const storedPhone = this.formatPhoneForStorage(this.checkoutForm.value.phoneNumber);
    
    const orderData = {
      customer: {
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phoneNumber: storedPhone
      },
      delivery: {
        county: countyValue,
        town: this.deliveryForm.value.town,
        address: this.deliveryForm.value.address,
        deliveryNotes: this.deliveryForm.value.deliveryNotes || '',
        method: this.getSelectedDeliveryName(),
        cost: 0,
        selectedOption: this.selectedDelivery
      },
      items: this.cartItems,
      subtotal: this.subtotal,
      total: this.subtotal,
      deliveryCost: 0,
      paymentStatus: 'pending',
      requiresDeliveryConfirmation: true
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
        subtotal: orderData.subtotal,
        total: orderData.total,
        deliveryCost: 0,
        status: 'pending_payment_confirmation',
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
    
    if (value.length > 0) {
      if (value.startsWith('0')) {
        value = value.substring(1);
      }
      
      if (!value.startsWith('7') && !value.startsWith('1')) {
        value = '7' + value;
      }
      
      if (value.length > 9) {
        value = value.substring(0, 9);
      }
    }
    
    this.checkoutForm.patchValue({ phoneNumber: value });
    
    const confirmPhone = this.checkoutForm.get('confirmPhone')?.value;
    const oldValueWithZero = '0' + value.substring(0, value.length - 1);
    if (confirmPhone === oldValueWithZero || confirmPhone === value) {
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
    return this.subtotal >= this.FREE_DELIVERY_THRESHOLD;
  }

  getDeliveryTime(): string {
    const selected = this.deliveryOptions.find(opt => opt.id === this.selectedDelivery);
    return selected ? selected.days : '2-3 business days';
  }

  confirmPaymentMade(): void {
    this.isLoading = true;
    
    if (this.orderService) {
      this.orderService.confirmPayment(this.orderCode, {
        amount: this.subtotal,
        phoneNumber: this.formatPhoneForStorage(this.checkoutForm.value.phoneNumber)
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
    this.calculateSubtotal();
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

  setCountyInputMode(mode: 'select' | 'manual'): void {
    this.countyInputMode = mode;
    
    this.countySuggestions = [];
    
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
    ).slice(0, 5);
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
    return {
      orderNumber: this.orderCode,
      items: this.cartItems,
      subtotal: this.subtotal,
      delivery: {
        method: this.getSelectedDeliveryName(),
        status: 'to_be_confirmed',
        freeEligible: this.isFreeDeliveryEligible()
      },
      totalPaid: this.subtotal,
      customer: {
        ...this.checkoutForm.value,
        phoneNumber: this.formatPhoneForDisplay(this.checkoutForm.value.phoneNumber)
      },
      deliveryInfo: {
        ...this.deliveryForm.value,
        county: this.getCountyValue()
      }
    };
  }
}