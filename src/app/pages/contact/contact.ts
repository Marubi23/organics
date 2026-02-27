import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  
  readonly displayPhone = '+254 701 934 918';
  readonly whatsappNumber = '254701934918';
  readonly email = 'info@mzuriorganics.co.ke';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^[0-9+\-\s]*$/)],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate sending (in production, this would be an API call)
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        this.contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 1500);
      
      // Here you would typically send to your backend
      console.log('Form submitted:', this.contactForm.value);
    } else {
      // Mark all fields as touched to show validation
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  callUs() {
    window.location.href = `tel:${this.displayPhone.replace(/\s/g, '')}`;
  }

  openWhatsApp() {
    const message = encodeURIComponent(
      "Hello Mzuri Organics! I'd like to learn more about your products and services."
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  sendEmail() {
    window.location.href = `mailto:${this.email}`;
  }

  formatPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.substring(0, 9);
    
    // Format as 07XX XXX XXX
    if (value.length > 0) {
      if (value.startsWith('0')) {
        value = value.substring(1);
      }
      if (value.length > 0) {
        if (value.length > 6) {
          value = `07${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6)}`;
        } else if (value.length > 3) {
          value = `07${value.substring(0, 3)} ${value.substring(3)}`;
        } else {
          value = `07${value}`;
        }
      }
    }
    
    this.contactForm.patchValue({ phone: value }, { emitEvent: false });
  }
}