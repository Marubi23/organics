import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  errorMessage = '';
  
  readonly displayPhone = '+254 701 934 918';
  readonly whatsappNumber = '254701934918';
  readonly email = 'info@mzuriorganics.co.ke';
  
  // Mzuri Organics coordinates - Musembe Market, Kakamega
  private readonly MZURI_LAT = 0.6023014;
  private readonly MZURI_LNG = 34.9352222;
  
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
  
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;
  private circle: L.Circle | null = null;
  
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
    // Initialize map after view renders
    setTimeout(() => {
      this.initMap();
    }, 500);
    await this.loadLottieAnimations();
  }
  
  ngOnDestroy() {
    // Clean up map instance
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
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
      
      // Hero main lottie
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
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }
    
    // Create map centered on Mzuri Organics
    this.map = L.map('location-map', {
      center: [this.MZURI_LAT, this.MZURI_LNG],
      zoom: 17,
      zoomControl: true,
      fadeAnimation: true,
      attributionControl: true,
      scrollWheelZoom: true,
      dragging: true
    });
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 10
    }).addTo(this.map);
    
    // Create custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container" style="position:relative; text-align:center;">
          <div class="marker-pulse" style="
            position:absolute;
            top:50%;
            left:50%;
            transform:translate(-50%, -50%);
            width:60px;
            height:60px;
            border-radius:50%;
            background:rgba(136, 196, 49, 0.3);
            animation: markerPulse 2s infinite;
          "></div>
          <i class="fas fa-map-marker-alt" style="
            color: #88c431;
            font-size: 2.8rem;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));
            position:relative;
            z-index:2;
          "></i>
          <div style="
            position:absolute;
            bottom:-8px;
            left:50%;
            transform:translateX(-50%);
            width:12px;
            height:12px;
            background:#88c431;
            border-radius:50%;
            box-shadow:0 0 20px rgba(136,196,49,0.6);
          "></div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -45]
    });
    
    // Add marker
    this.marker = L.marker([this.MZURI_LAT, this.MZURI_LNG], { 
      icon: customIcon,
      riseOnHover: true,
      zIndexOffset: 1000
    }).addTo(this.map);
    
    // Add glowing circle
    this.circle = L.circle([this.MZURI_LAT, this.MZURI_LNG], {
      color: '#88c431',
      fillColor: '#88c431',
      fillOpacity: 0.15,
      radius: 60,
      weight: 3,
      opacity: 0.6,
      className: 'glow-circle'
    }).addTo(this.map);
    
    // Create popup content
    const popupContent = `
      <div style="text-align: center; min-width: 280px; max-width: 320px; font-family: 'Inter', sans-serif;">
        <div style="
          background: linear-gradient(135deg, #0d2b12, #1a4a22);
          padding: 16px 20px;
          border-radius: 16px 16px 0 0;
          margin: -12px -12px 12px -12px;
        ">
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <div style="
              width: 40px;
              height: 40px;
              background: #88c431;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 14px;
              color: #0d2b12;
            ">M</div>
            <div>
              <h4 style="margin:0; font-weight:700; color: #c8841a; font-size: 1.1rem;">
                Mzuri Organics
              </h4>
              <p style="margin:0; color: #88c431; font-size: 0.8rem; opacity:0.8;">
                 Organic Farm & Market
              </p>
            </div>
          </div>
        </div>
        
        <div style="padding: 0 4px 8px 4px;">
          <div style="display:flex; align-items:center; gap:6px; color:#4a5b4a; font-size:0.9rem; margin-bottom:6px;">
            <i class="fas fa-map-pin" style="color:#88c431;"></i>
            <span>Musembe Shopping Center</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; color:#4a5b4a; font-size:0.85rem; margin-bottom:6px;">
            <i class="fas fa-road" style="color:#88c431;"></i>
            <span>Eldoret – Malaba Road</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; color:#4a5b4a; font-size:0.85rem; margin-bottom:12px;">
            <i class="fas fa-city" style="color:#88c431;"></i>
            <span>Kakamega, Kenya</span>
          </div>
          
          <div style="display: flex; gap: 10px; justify-content: center; padding: 8px 0; border-top: 1px solid #e8f0e0;">
            <a href="tel:+254701934918" style="
              background: #88c431; 
              color: white; 
              padding: 8px 20px; 
              border-radius: 25px;
              text-decoration: none; 
              font-weight: 600; 
              font-size: 0.85rem;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              <i class="fas fa-phone-alt"></i> Call
            </a>
            <a href="https://wa.me/254701934918" target="_blank" style="
              background: #25D366; 
              color: white; 
              padding: 8px 20px; 
              border-radius: 25px;
              text-decoration: none; 
              font-weight: 600; 
              font-size: 0.85rem;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Bind popup with the content
    this.marker.bindPopup(popupContent, {
      maxWidth: 340,
      className: 'custom-popup',
      closeButton: true,
      autoPan: true
    });
    
    // Open popup by default
    setTimeout(() => {
      if (this.marker) {
        this.marker.openPopup();
      }
    }, 800);
    
    // Handle resize
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 300);
    
    // Add zoom animation style
    this.injectMapStyles();
  }
  
  private injectMapStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes markerPulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.8);
          opacity: 0;
        }
      }
      
      .custom-popup .leaflet-popup-content-wrapper {
        border-radius: 16px !important;
        border-left: 4px solid #88c431 !important;
        box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
        padding: 0 !important;
        overflow: hidden !important;
      }
      
      .custom-popup .leaflet-popup-tip {
        background: #0d2b12 !important;
        border-left: 4px solid #88c431 !important;
      }
      
      .custom-popup .leaflet-popup-close-button {
        color: white !important;
        font-size: 20px !important;
        padding: 8px 12px !important;
        background: transparent !important;
        opacity: 0.8 !important;
      }
      
      .custom-popup .leaflet-popup-close-button:hover {
        opacity: 1 !important;
        color: #88c431 !important;
      }
      
      .glow-circle {
        animation: glowPulse 3s ease-in-out infinite;
      }
      
      @keyframes glowPulse {
        0%, 100% {
          opacity: 0.6;
          r: 60;
        }
        50% {
          opacity: 1;
          r: 80;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Clear map (remove all markers and layers)
  clearMap(): void {
    if (!this.map) return;
    
    // Remove marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    
    // Remove circle
    if (this.circle) {
      this.map.removeLayer(this.circle);
      this.circle = null;
    }
    
    // Reset view to center
    this.map.setView([this.MZURI_LAT, this.MZURI_LNG], 17);
    
    // Re-add marker and circle after clearing
    setTimeout(() => {
      this.initMap();
    }, 300);
  }
  
  // Update map view
  refreshMap(): void {
    if (this.map) {
      this.map.invalidateSize();
      this.map.setView([this.MZURI_LAT, this.MZURI_LNG], 17);
    }
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
    const address = 'Mzuri Organics, Musembe Shopping Center, Eldoret – Malaba Road, Kakamega, Kenya';
    navigator.clipboard.writeText(address).then(() => {
      // You could also show a toast notification here
      console.log('Address copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
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
 *MESSAGE*
━━━━━━━━━━━━━━━━━━━━━
${data.message}

━━━━━━━━━━━━━━━━━━━━━
 *Location:* Mzuri Organics, Musembe Market, Kakamega
 *Sent from Mzuri Organics Website`;
  }
  
  openDirectWhatsApp() {
    const message = encodeURIComponent(
      `Hello Mzuri Organics! \n\nI'm interested in learning more about your products.`
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