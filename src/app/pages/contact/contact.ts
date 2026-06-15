import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage = '';
  
  readonly displayPhone = '+254 701 934 918';
  readonly whatsappNumber = '254701934918';
  readonly email = 'info@mzuriorganics.co.ke';
  
  businessHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: '10:00 AM - 2:00 PM' }
  ];
  
  socialLinks = [
    { platform: 'WhatsApp', icon: 'fab fa-whatsapp', url: `https://wa.me/${this.whatsappNumber}`, color: '#25D366', lottieId: 'whatsappSocialLottie' },
    { platform: 'Facebook', icon: 'fab fa-facebook', url: 'https://facebook.com/mzuriorganics', color: '#1877F2', lottieId: 'facebookLottie' },
    { platform: 'Twitter', icon: 'fab fa-twitter', url: 'https://twitter.com/mzuriorganics', color: '#1DA1F2', lottieId: 'twitterLottie' },
    { platform: 'Instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/mzuriorganics', color: '#E4405F', lottieId: 'instagramLottie' }
  ];
  
  private map: any;
  
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
  
  async ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 500);
    await this.loadLottieAnimations();
  }
  
  private async loadLottieAnimations() {
    try {
      const lottie = await import('lottie-web');
      
      // Hero badge lottie
      const heroBadge = document.getElementById('heroBadgeLottie');
      if (heroBadge) {
        lottie.default.loadAnimation({
          container: heroBadge,
          path: '/assets/animations/locationlottie.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      // Hero main lottie (replaces "Let's Grow Together" text)
      const heroMain = document.getElementById('heroMainLottie');
      if (heroMain) {
        lottie.default.loadAnimation({
          container: heroMain,
          path: '/assets/animations/lottieflow-ecommerce-14-18-c8841a-easey.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      // Phone card lottie
      const phoneCard = document.getElementById('phoneCardLottie');
      if (phoneCard) {
        lottie.default.loadAnimation({
          container: phoneCard,
          path: 'assets/animations/lottieflow-ecommerce-14-18-c8841a-easey.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      // WhatsApp card lottie
      const whatsappCard = document.getElementById('whatsappCardLottie');
      if (whatsappCard) {
        lottie.default.loadAnimation({
          container: whatsappCard,
          path: 'assets/animations/lottieflow-social-networks-16-11-2d6a2e-easey.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      // Email card lottie
      const emailCard = document.getElementById('emailCardLottie');
      if (emailCard) {
        lottie.default.loadAnimation({
          container: emailCard,
          path: 'assets/animations/maillottie.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      // Social media lotties
      const whatsappSocial = document.getElementById('whatsappSocialLottie');
      if (whatsappSocial) {
        lottie.default.loadAnimation({
          container: whatsappSocial,
          path: '/assets/animations/lottieflow-social-networks-16-11-2d6a2e-easey.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      const facebookLottie = document.getElementById('facebookLottie');
      if (facebookLottie) {
        lottie.default.loadAnimation({
          container: facebookLottie,
          path: 'assets/animations/facebooklottie.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      const twitterLottie = document.getElementById('twitterLottie');
      if (twitterLottie) {
        lottie.default.loadAnimation({
          container: twitterLottie,
          path: 'assets/animations/twitterlottie.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
      const instagramLottie = document.getElementById('instagramLottie');
      if (instagramLottie) {
        lottie.default.loadAnimation({
          container: instagramLottie,
          path: 'assets/animations/instagramlottie.json',
          renderer: 'svg',
          loop: true,
          autoplay: true
        });
      }
      
    } catch (error) {
      console.log('Lottie loading error:', error);
    }
  }
  
  private initMap(): void {
    const mapElement = document.getElementById('location-map');
    if (!mapElement) return;
    
    this.map = L.map('location-map').setView([0.6023014, 34.9352222], 17);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
    
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="marker-pulse"><i class="fas fa-map-marker-alt" style="color: #88c431; font-size: 2.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));"></i></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
    
    const marker = L.marker([0.6023014, 34.9352222], { icon: customIcon }).addTo(this.map);
    
    L.circle([0.6023014, 34.9352222], {
      color: '#88c431',
      fillColor: '#88c431',
      fillOpacity: 0.1,
      radius: 50
    }).addTo(this.map);
    
    marker.bindPopup(`
      <div style="text-align: center; min-width: 250px;">
        <div style="background: #88c431; color: #0d2b12; padding: 12px; border-radius: 12px 12px 0 0;">
          <h4 style="margin:0; font-weight:700;">🌱 Mzuri Organics</h4>
        </div>
        <p style="margin:12px 0 5px;"><strong>📍 Musembe Market</strong></p>
        <p style="margin:0 0 5px; color:#666;">Eldoret – Malaba Road</p>
        <p style="margin:0 0 12px; color:#666;">Kakamega, Kenya</p>
        <div style="display: flex; justify-content: center; gap: 15px; padding: 8px 0;">
          <a href="tel:+254701934918" style="color: #88c431; text-decoration: none; font-weight:600;">📞 Call</a>
          <a href="https://wa.me/254701934918" target="_blank" style="color: #25D366; text-decoration: none; font-weight:600;">💬 WhatsApp</a>
        </div>
      </div>
    `).openPopup();
  }
  
  openDirections() {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Mzuri+Organics+Musembe+Market+Kakamega', '_blank');
  }
  
  viewLargerMap() {
    window.open('https://www.google.com/maps/place/Mzuri+Organics/@0.6023014,34.9352222,17z', '_blank');
  }
  
  openStreetView() {
    window.open('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=0.6023014,34.9352222', '_blank');
  }
  
  copyAddress() {
    navigator.clipboard.writeText('Mzuri Organics, Musembe Shopping Center, Eldoret – Malaba Road, Kakamega, Kenya');
    alert(' Address copied to clipboard!');
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
📍 *Location:* Mzuri Organics, Musembe Market, Kakamega
✅ *Sent from Mzuri Organics Website`;
  }
  
  openDirectWhatsApp() {
    const message = encodeURIComponent(
      `Hello Mzuri Organics! 👋\n\nI'm interested in learning more about your products.`
    );
    window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank');
  }
  
  callUs() {
    window.location.href = `tel:${this.displayPhone.replace(/\s/g, '')}`;
  }
  
  sendEmail() {
    const subject = encodeURIComponent('Inquiry from Mzuri Organics Website');
    const body = encodeURIComponent(`Hello Mzuri Organics Team,\n\nI'm interested in learning more about your products and services.\n\nRegards,`);
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