import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartComponent } from '../cart/cart';
import { OrderService, CreateOrderResponse } from '../../services/order';
import { ToastService } from '../../services/toast';
import { trigger, transition, style, animate } from '@angular/animations';

declare var navigator: any;

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
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms ease', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit {
  currentStep: number = 1;
  cartItems: any[] = [];
  totalAmount: number = 0;
  subtotal: number = 0;
  orderCode: string = '';
  
  // Location capture
  userLocation: { lat: number; lng: number } | null = null;
  isLocating: boolean = false;
  locationError: string | null = null;
  locationCaptured: boolean = false;
  
  // Collapsible state
  addressSectionOpen: boolean = true;
  instructionsSectionOpen: boolean = false;
  
  selectedDelivery: string = 'standard';
  checkoutForm!: FormGroup;
  deliveryForm!: FormGroup;
  showConfirmationModal: boolean = false;
  isLoading: boolean = false;
  
  // WhatsApp configuration - make these public for template
  readonly tillNumber: string = '8589836';
  readonly whatsappNumber: string = '254701934918';
  readonly displayPhoneNumber: string = '+254 701 934918';
  readonly businessName: string = 'Mzuri Organics';
  readonly freeDeliveryThreshold: number = 25000;

  // Counties
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
    this.autoDetectLocation();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {}

  private initializeForms(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(0?7|0?1)\d{8}$/)]],
      confirmPhone: ['', Validators.required]
    }, { validators: this.phoneMatchValidator });

    this.deliveryForm = this.fb.group({
      county: ['', Validators.required],
      countyManual: [''],
      town: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      deliveryNotes: ['']
    });

    this.deliveryForm.get('countyManual')?.valueChanges.subscribe(value => {
      this.filterCountySuggestions(value);
    });

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

  // ============================================
  // LOCATION CAPTURE
  // ============================================
  autoDetectLocation(): void {
    if (!navigator.geolocation) {
      this.locationError = 'Geolocation not supported';
      return;
    }

    this.isLocating = true;
    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.locationCaptured = true;
        this.isLocating = false;
        this.locationError = null;
        
        if (this.toastService) {
          this.toastService.showSuccess('📍 Location detected!');
        }
      },
      (error: any) => {
        console.error('Location error:', error);
        this.isLocating = false;
        this.locationError = error.message || 'Could not get location';
        if (this.toastService) {
          this.toastService.showWarning('Please allow location access for faster delivery');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  retryLocation(): void {
    this.locationError = null;
    this.autoDetectLocation();
  }

  getLocationDisplay(): string {
    if (!this.userLocation) return 'Location not captured';
    return `${this.userLocation.lat.toFixed(6)}, ${this.userLocation.lng.toFixed(6)}`;
  }

  // ============================================
  // CART
  // ============================================
  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateSubtotal();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      if (this.toastService) {
        this.toastService.showWarning('Your cart is empty.');
      }
    }
  }

  calculateSubtotal(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    this.totalAmount = this.subtotal;
  }

  // ============================================
  // DELIVERY
  // ============================================
  getCountyValue(): string {
    if (this.countyInputMode === 'select') {
      const selectedCounty = this.counties.find(c => c.toLowerCase() === this.deliveryForm.value.county);
      return selectedCounty || this.deliveryForm.value.county || '';
    } else {
      return this.deliveryForm.value.countyManual || '';
    }
  }

  isFreeDeliveryEligible(): boolean {
    return this.subtotal >= this.freeDeliveryThreshold;
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

  isDeliveryFormValid(): boolean {
    const county = this.getCountyValue();
    const town = this.deliveryForm.get('town')?.value;
    const address = this.deliveryForm.get('address')?.value;
    return !!(county && town && address);
  }

  toggleAddressSection(): void {
    this.addressSectionOpen = !this.addressSectionOpen;
  }

  toggleInstructionsSection(): void {
    this.instructionsSectionOpen = !this.instructionsSectionOpen;
  }

  // ============================================
  // COUNTY METHODS
  // ============================================
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

  // ============================================
  // NAVIGATION
  // ============================================
  nextStep(): void {
    if (this.currentStep === 1 && this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      if (this.toastService) {
        this.toastService.showError('Please fill in all required details.');
      }
      return;
    }
    
    if (this.currentStep === 2 && !this.isDeliveryFormValid()) {
      this.markFormGroupTouched(this.deliveryForm);
      if (this.toastService) {
        this.toastService.showError('Please fill in all delivery information.');
      }
      return;
    }
    
    if (this.currentStep < 3) {
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

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // ============================================
  // ORDER
  // ============================================
  generateOrderCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderCode = `MZ${timestamp}${random}`;
    return this.orderCode;
  }

  // ============================================
  // WHATSAPP MESSAGE - FULL DETAILS
  // ============================================
  generateWhatsAppMessage(): string {
    const customer = this.checkoutForm.value;
    const delivery = this.deliveryForm.value;
    const county = this.getCountyValue();
    const displayPhone = this.formatPhoneForDisplay(customer.phoneNumber);
    const itemsList = this.cartItems.map(item => 
      `• ${item.quantity}x ${item.name} - KES ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const freeDeliveryNote = this.isFreeDeliveryEligible() 
      ? '✅ ELIGIBLE FOR FREE DELIVERY (order above KES 25,000)' 
      : '💰 Please assess distance and confirm delivery cost';
    
    const locationInfo = this.userLocation 
      ? `📍 Customer Location: ${this.userLocation.lat.toFixed(6)}, ${this.userLocation.lng.toFixed(6)}`
      : '📍 Location: Not captured (please request)';

    const message = `*🌱 MZURI ORGANICS - NEW ORDER #${this.orderCode}*

📅 *Date:* ${new Date().toLocaleString('en-KE', { 
  day: '2-digit', month: 'short', year: 'numeric',
  hour: '2-digit', minute: '2-digit'
})}

━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━━
• *Name:* ${customer.firstName} ${customer.lastName}
• *Phone:* ${displayPhone}
• *Email:* ${customer.email}

━━━━━━━━━━━━━━━━━━━━━
📍 *DELIVERY ADDRESS*
━━━━━━━━━━━━━━━━━━━━━
• *Town/City:* ${delivery.town}
• *County:* ${county}
• *Address:* ${delivery.address}
${delivery.deliveryNotes ? `• *Notes:* ${delivery.deliveryNotes}` : ''}

━━━━━━━━━━━━━━━━━━━━━
📍 *LOCATION COORDINATES*
━━━━━━━━━━━━━━━━━━━━━
${locationInfo}

━━━━━━━━━━━━━━━━━━━━━
🛒 *ITEMS ORDERED (${this.cartItems.length} items)*
━━━━━━━━━━━━━━━━━━━━━
${itemsList}

━━━━━━━━━━━━━━━━━━━━━
💰 *PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━
• *Subtotal:* KES ${this.subtotal.toLocaleString()}
• *Delivery:* ${this.isFreeDeliveryEligible() ? 'FREE ✅' : 'TBC via WhatsApp'}
━━━━━━━━━━━━━━━━━━━━━
• *TOTAL TO PAY:* KES ${this.subtotal.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━
💳 *MPESA PAYMENT*
━━━━━━━━━━━━━━━━━━━━━
• *Till Number:* ${this.tillNumber}
• *Amount:* KES ${this.subtotal.toLocaleString()}
• *Status:* Pending Confirmation

📌 *IMPORTANT:*
1. Customer has paid to Till ${this.tillNumber}
2. Please confirm payment and assess delivery
3. ${freeDeliveryNote}

━━━━━━━━━━━━━━━━━━━━━
📎 *ATTACHMENTS REQUIRED:*
━━━━━━━━━━━━━━━━━━━━━
☑ M-Pesa confirmation screenshot
☑ Delivery address confirmation

━━━━━━━━━━━━━━━━━━━━━
*Status:* ⏳ Awaiting Confirmation
*Payment Method:* M-Pesa Till ${this.tillNumber}

*Thank you for choosing Mzuri Organics! 🌱*`;

    return encodeURIComponent(message);
  }

  // ============================================
  // WHATSAPP ACTIONS
  // ============================================
  openWhatsAppWithMessage(): void {
    if (!this.checkoutForm.valid || !this.isDeliveryFormValid()) {
      if (this.toastService) {
        this.toastService.showError('Please complete all required fields.');
      }
      return;
    }
    
    const message = this.generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    if (this.toastService) {
      this.toastService.showSuccess('📱 WhatsApp opened with your order details!');
    }
  }

  // ============================================
  // FORM ACTIONS
  // ============================================
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
        method: 'WhatsApp Confirmation',
        cost: 0,
        selectedOption: this.selectedDelivery,
        location: this.userLocation
      },
      items: this.cartItems,
      subtotal: this.subtotal,
      total: this.subtotal,
      deliveryCost: 0,
      paymentStatus: 'pending',
      orderCode: this.orderCode,
      tillNumber: this.tillNumber
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
            this.openWhatsAppWithMessage();
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
          this.showConfirmationModal = true;
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
        status: 'pending_payment_confirmation',
        paymentMethod: 'mpesa_till',
        tillNumber: this.tillNumber,
        whatsappNumber: this.whatsappNumber,
        createdAt: new Date().toISOString(),
        location: this.userLocation
      };
      
      localStorage.setItem(`order_${this.orderCode}`, JSON.stringify(order));
      this.showConfirmationModal = true;
      this.openWhatsAppWithMessage();
    }
  }

  // ============================================
  // MODAL
  // ============================================
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

  // ============================================
  // UTILITY
  // ============================================
  formatPhoneForDisplay(phone: string): string {
    if (!phone) return '';
    if (phone.match(/^[71]/)) {
      return '0' + phone;
    }
    return phone;
  }

  formatPhoneForStorage(phone: string): string {
    if (!phone) return '';
    return phone.replace(/^0/, '');
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

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      if (this.toastService) {
        this.toastService.showSuccess('Copied to clipboard!');
      }
    }).catch(() => {
      if (this.toastService) {
        this.toastService.showError('Failed to copy');
      }
    });
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateSubtotal();
  }

  formatCurrency(amount: number): string {
    return 'KES ' + amount.toLocaleString('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}