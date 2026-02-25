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
  newsletterForm: FormGroup;
  isSubmitting = false;
  newsletterSubmitted = false;
  
  // WhatsApp Configuration
  readonly WHATSAPP_NUMBER: string = '254701934918';
  readonly DISPLAY_PHONE_NUMBER: string = '+254 701 934 918';
  readonly BUSINESS_NAME: string = 'Mzuri Organics';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(07|7|01)\d{8}$/)
      ]],
      subject: ['general'],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Format phone number for WhatsApp
      let phoneNumber = this.contactForm.value.phone;
      // Remove any non-digit characters
      phoneNumber = phoneNumber.replace(/\D/g, '');
      // Ensure it starts with 254
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '254' + phoneNumber.substring(1);
      } else if (phoneNumber.startsWith('7')) {
        phoneNumber = '254' + phoneNumber;
      }
      
      // Generate WhatsApp message with form data
      const message = this.generateWhatsAppMessage(phoneNumber);
      
      // Open WhatsApp with the pre-filled message
      const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      // Also send email notification (simulated)
      this.sendEmailNotification();
      
      // Reset form after sending
      setTimeout(() => {
        this.contactForm.reset({
          name: '',
          email: '',
          phone: '',
          subject: 'general',
          message: ''
        });
        this.isSubmitting = false;
      }, 500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  generateWhatsAppMessage(phoneNumber: string): string {
    const formData = this.contactForm.value;
    
    // Map subject codes to readable text
    const subjectMap: { [key: string]: string } = {
      'general': 'General Inquiry',
      'product': 'Product Information',
      'order': 'Order Inquiry',
      'partnership': 'Partnership Opportunity',
      'support': 'Technical Support',
      'other': 'Other'
    };
    
    const subjectText = subjectMap[formData.subject] || formData.subject;
    
    const message = `
*${this.BUSINESS_NAME} - Contact Form Submission*

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Phone:* ${formData.phone}

📋 *Subject:* ${subjectText}

💬 *Message:*
${formData.message}

---
*Sent via Mzuri Organics Website Contact Form*
    `.trim();
    
    return encodeURIComponent(message);
  }

  sendEmailNotification() {
    // This would typically be an API call to your backend
    console.log('Sending email notification:', {
      to: 'info@mzuriorganics.co.ke',
      from: this.contactForm.value.email,
      subject: `Contact Form: ${this.contactForm.value.subject}`,
      body: this.generateEmailBody()
    });
    
    // Simulate API call
    setTimeout(() => {
      console.log('Email notification sent successfully');
    }, 1000);
  }

  generateEmailBody(): string {
    const formData = this.contactForm.value;
    
    const subjectMap: { [key: string]: string } = {
      'general': 'General Inquiry',
      'product': 'Product Information',
      'order': 'Order Inquiry',
      'partnership': 'Partnership Opportunity',
      'support': 'Technical Support',
      'other': 'Other'
    };
    
    return `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${subjectMap[formData.subject] || formData.subject}

Message:
${formData.message}
    `;
  }

  onNewsletterSubmit() {
    if (this.newsletterForm.valid) {
      this.newsletterSubmitted = true;
      
      // Generate WhatsApp message for newsletter subscription
      const email = this.newsletterForm.value.email;
      const message = encodeURIComponent(`
*${this.BUSINESS_NAME} - Newsletter Subscription*

📧 *Email:* ${email}

I would like to subscribe to the Mzuri Organics newsletter to receive updates on products, farming tips, and exclusive offers.
      `);
      
      // Open WhatsApp with newsletter subscription message
      const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      // Simulate API call
      setTimeout(() => {
        this.newsletterForm.reset();
        this.newsletterSubmitted = false;
      }, 3000);
    } else {
      this.newsletterForm.get('email')?.markAsTouched();
    }
  }

  // Helper method to format phone number as user types
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
    
    this.contactForm.patchValue({ phone: value }, { emitEvent: false });
  }

  // Helper method to open WhatsApp directly with business number
  openWhatsAppDirect(): void {
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_NUMBER}`;
    window.open(whatsappUrl, '_blank');
  }

  // Getter for easy access in template
  get formControls() {
    return this.contactForm.controls;
  }
}