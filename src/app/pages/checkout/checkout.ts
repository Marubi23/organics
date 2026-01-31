// src/app/pages/checkout/checkout.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService,CartItem } from '../../services/cart';
import { MpesaService,PaymentRequest,PaymentResponse} from '../../services/mpesa'
import { from } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  totalAmount: number = 0;
  cartItems: CartItem[] = [];
  isLoading: boolean = false;
  paymentStatus: string = '';
  paymentError: string = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private mpesaService: MpesaService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(07\d{8}|\+2547\d{8}|2547\d{8})$/)]],
      address: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.totalAmount = this.cartService.getTotalPrice();
    });
  }

  formatPhoneNumber(phone: string): string {
    let formatted = phone.trim();
    if (formatted.startsWith('0')) {
      return '254' + formatted.substring(1);
    } else if (formatted.startsWith('+254')) {
      return formatted.substring(1);
    }
    return formatted;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.initiatePayment();
    } else {
      this.markFormGroupTouched(this.checkoutForm);
    }
  }

  initiatePayment(): void {
    this.isLoading = true;
    this.paymentStatus = '';
    this.paymentError = '';

    const formData = this.checkoutForm.value;
    const paymentData: PaymentRequest = {
      phoneNumber: this.formatPhoneNumber(formData.phoneNumber),
      amount: this.totalAmount,
      accountReference: `ORD-${Date.now()}`,
      transactionDesc: 'Organic Products Purchase'
    };

    this.mpesaService.initiatePayment(paymentData).subscribe({
      next: (response: PaymentResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.paymentStatus = 'success';
          this.paymentError = '';
          
          this.cartService.clearCart();
          
          setTimeout(() => {
            this.router.navigate(['/order-success'], {
              queryParams: { 
                reference: response.checkoutRequestID 
              }
            });
          }, 3000);
        } else {
          this.paymentError = response.message;
          this.paymentStatus = 'error';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.paymentError = 'Payment initiation failed. Please try again.';
        this.paymentStatus = 'error';
        console.error('Payment error:', error);
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
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
}