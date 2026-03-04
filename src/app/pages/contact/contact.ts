import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

// Fix for Leaflet marker icons in Angular
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, CartComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage = '';
  
  // Contact Details
  readonly displayPhone = '+254 701 934 918';
  readonly whatsappNumber = '254701934918';
  readonly email = 'info@mzuriorganics.co.ke';
  
  // Location Details - Musembe Market, Kakamega (Corrected coordinates)
  readonly location = {
    address: 'Musembe Shopping Center, Eldoret – Malaba Road, P.O Box 254711949520 – 50100, Kakamega, Kenya',
    shortAddress: 'Musembe Market, Kakamega, Kenya',
    coordinates: { lat: 0.3036, lng: 34.7543 },
    market: 'Musembe Market'
  };

  // Business Hours
  businessHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: '10:00 AM - 2:00 PM' }
  ];

  // Social Media
  socialLinks = [
    { platform: 'WhatsApp', icon: 'fab fa-whatsapp', url: `https://wa.me/${this.whatsappNumber}`, color: '#25D366' },
    { platform: 'Facebook', icon: 'fab fa-facebook', url: 'https://facebook.com/mzuriorganics', color: '#1877F2' },
    { platform: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/mzuriorganics', color: '#1DA1F2' },
    { platform: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/mzuriorganics', color: '#E4405F' },
    { platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/@mzuriorganics', color: '#FF0000' }
  ];

  // Leaflet map
  private map: any;
  private marker: any;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      inquiryType: ['general', Validators.required]
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    const mapElement = document.getElementById('location-map');
    if (!mapElement) return;

    // Initialize the map
    this.map = L.map('location-map').setView(
      [this.location.coordinates.lat, this.location.coordinates.lng], 
      15
    );

    // Add OpenStreetMap tiles (completely free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Custom green icon to match Mzuri brand
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<i class="fas fa-map-marker-alt" style="color: #88c431; font-size: 2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);"></i>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    // Add marker
    this.marker = L.marker(
      [this.location.coordinates.lat, this.location.coordinates.lng], 
      { icon: customIcon }
    ).addTo(this.map);

    // Add popup
    this.marker.bindPopup(`
      <div style="text-align: center; min-width: 200px;">
        <h4 style="margin:0 0 8px; color:#1a2e1f;">📍 Mzuri Organics</h4>
        <p style="margin:0 0 5px; color:#5a6b5a;"><strong>Musembe Market</strong></p>
        <p style="margin:0 0 5px; color:#5a6b5a; font-size:13px;">Eldoret – Malaba Road</p>
        <p style="margin:0; color:#5a6b5a; font-size:13px;">Kakamega, Kenya</p>
        <hr style="margin:8px 0; border-color:#e8ede8;">
        <p style="margin:0; color:#88c431; font-size:12px;">📞 ${this.displayPhone}</p>
      </div>
    `).openPopup();
  }

  openDirections() {
    const destination = encodeURIComponent(this.location.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  }

  openStreetView() {
    const lat = this.location.coordinates.lat;
    const lng = this.location.coordinates.lng;
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`, '_blank');
  }

  viewLargerMap() {
    const destination = encodeURIComponent(this.location.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${destination}`, '_blank');
  }

  copyAddress() {
    navigator.clipboard.writeText(this.location.address);
    this.showToast('Address copied to clipboard!');
  }

  private showToast(message: string) {
    // Simple alert for now - you can replace with your toast system
    alert(message);
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      try {
        const success = this.openWhatsAppWithFormData();
        
        if (success) {
          this.showSuccessMessage = true;
          this.contactForm.reset();
          
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
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  openWhatsAppWithFormData(): boolean {
    const formData = this.contactForm.value;
    const message = this.formatWhatsAppMessage(formData);
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrls = [
      `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`,
      `https://api.whatsapp.com/send?phone=${this.whatsappNumber}&text=${encodedMessage}`,
      `whatsapp://send?phone=${this.whatsappNumber}&text=${encodedMessage}`
    ];
    
    for (const url of whatsappUrls) {
      try {
        const windowRef = window.open(url, '_blank');
        if (windowRef) return true;
      } catch (e) {
        continue;
      }
    }
    
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
    
    const inquiryTypes: any = {
      'general': 'General Inquiry',
      'products': 'Product Information',
      'pricing': 'Pricing & Quotes',
      'partnership': 'Partnership Opportunity',
      'support': 'Technical Support',
      'visit': 'Farm Visit'
    };
    
    return `🔔 *NEW CONTACT - Mzuri Organics*
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${currentDate}
📌 *Inquiry:* ${inquiryTypes[data.inquiryType] || 'General'}
━━━━━━━━━━━━━━━━━━━━━

👤 *CONTACT DETAILS*
━━━━━━━━━━━━━━━━━━━━━
• *Name:* ${data.name}
• *Email:* ${data.email}
• *Phone:* ${data.phone}

━━━━━━━━━━━━━━━━━━━━━
💬 *MESSAGE*
━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━
📍 *Location:* Musembe Market, Kakamega
✅ *Sent from Mzuri Organics Website`;
  }

  openDirectWhatsApp() {
    const message = encodeURIComponent(
      `Hello Mzuri Organics! 👋\n\nI'm interested in learning more about your products. I'm located near ${this.location.market}.`
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }

  callUs() {
    window.location.href = `tel:${this.displayPhone.replace(/\s/g, '')}`;
  }

  sendEmail() {
    const subject = encodeURIComponent('Inquiry from Mzuri Organics Website');
    const body = encodeURIComponent(`Hello Mzuri Organics Team,\n\nI'm interested in learning more about your products and services.\n\nLocation: ${this.location.market}\n\nRegards,`);
    window.location.href = `mailto:${this.email}?subject=${subject}&body=${body}`;
  }

  formatPhoneInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 10) value = value.substring(0, 10);
    
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

  trackSocialClick(platform: string) {
    console.log(`Social click: ${platform}`);
  }
}