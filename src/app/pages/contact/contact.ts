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
  errorMessage = '';
  
  // Contact Details - Verified working
  readonly displayPhone = '+254 701 934 918';
  readonly whatsappNumber = '254701934918'; // Format: country code without +
  readonly email = 'info@mzuriorganics.co.ke';

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      try {
        // Open WhatsApp with form data
        const success = this.openWhatsAppWithFormData();
        
        if (success) {
          this.showSuccessMessage = true;
          this.contactForm.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);
        } else {
          this.errorMessage = 'Could not open WhatsApp. Please try again or call us directly.';
        }
        
      } catch (error) {
        console.error('WhatsApp error:', error);
        this.errorMessage = 'Something went wrong. Please call us instead.';
      } finally {
        this.isSubmitting = false;
      }
      
    } else {
      // Mark all fields as touched to show validation
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  openWhatsAppWithFormData(): boolean {
    const formData = this.contactForm.value;
    
    // Format the message beautifully
    const message = this.formatWhatsAppMessage(formData);
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Multiple WhatsApp URL formats for maximum compatibility
    const whatsappUrls = [
      `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`,  // Standard
      `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`, // API
      `whatsapp://send?phone=${this.whatsappNumber}&text=${encodedMessage}` // App deep link
    ];
    
    // Try each URL until one works
    for (const url of whatsappUrls) {
      try {
        const windowRef = window.open(url, '_blank');
        if (windowRef) {
          return true; // Success!
        }
      } catch (e) {
        console.log('URL attempt failed:', url);
        continue; // Try next URL
      }
    }
    
    // If all URLs fail, open the web version as last resort
    window.open(`https://web.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`, '_blank');
    return true;
  }

  private formatWhatsAppMessage(data: any): string {
    const currentDate = new Date().toLocaleDateString('en-KE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `🔔 *NEW CONTACT FORM - Mzuri Organics*
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${currentDate}
━━━━━━━━━━━━━━━━━━━━━

👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━━
• *Name:* ${data.name}
• *Email:* ${data.email}
• *Phone:* ${data.phone}

━━━━━━━━━━━━━━━━━━━━━
💬 *MESSAGE*
━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━
✅ *Sent from Mzuri Organics Website*
🔗 www.mzuriorganics.co.ke`;
  }

  // Direct WhatsApp click without form
  openDirectWhatsApp() {
    const message = encodeURIComponent(
      `Hello Mzuri Organics! 👋\n\nI'd like to learn more about your products and services.`
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  // Call function
  callUs() {
    window.location.href = `tel:${this.displayPhone.replace(/\s/g, '')}`;
  }

  // Email function (opens default email app)
  sendEmail() {
    window.location.href = `mailto:${this.email}`;
  }

  // Format phone input nicely
  formatPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) value = value.substring(0, 10);
    
    // Format as 07XX XXX XXX
    if (value.length > 0) {
      if (value.startsWith('0')) {
        value = value.substring(1);
      }
      if (value.length > 0) {
        if (value.length > 6) {
          value = `0${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 10)}`;
        } else if (value.length > 3) {
          value = `0${value.substring(0, 3)} ${value.substring(3)}`;
        } else {
          value = `0${value}`;
        }
      }
    }
    
    this.contactForm.patchValue({ phone: value }, { emitEvent: false });
  }
}