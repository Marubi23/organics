import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var google: any; // For Google Maps

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
  
  // Location Details - Musembe Market, Kakamega
  readonly location = {
    address: 'Musembe Shopping Center, Eldoret – Malaba Road, P.O Box 254711949520 – 50100, Kakamega, Kenya',
    shortAddress: 'Musembe Market, Kakamega, Kenya',
    coordinates: { lat: 0.3036, lng: 34.7543 }, // Approximate coordinates for Kakamega area
    placeId: 'ChIJMXXXXXXXXX', // You can get this from Google Maps
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

  // Map configuration
  mapOptions: any = {
    center: { lat: 0.3036, lng: 34.7543 },
    zoom: 15,
    mapTypeId: 'roadmap',
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    styles: [
      {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#88c431" }, { "lightness": 30 }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#d49a42" }, { "lightness": 20 }]
      }
    ]
  };

  map: any;
  marker: any;
  infoWindow: any;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      inquiryType: ['general', Validators.required]
    });
  }

  ngOnInit() {
    // Load Google Maps API
    this.loadGoogleMapsAPI();
  }

  ngAfterViewInit() {
    // Initialize map after view loads
    setTimeout(() => {
      this.initMap();
    }, 1000);
  }

  loadGoogleMapsAPI() {
    // Check if API is already loaded
    if (typeof google !== 'undefined' && google.maps) {
      return;
    }

    // Load Google Maps API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  initMap() {
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps API not loaded');
      return;
    }

    const mapElement = document.getElementById('location-map');
    if (!mapElement) return;

    // Initialize map
    this.map = new google.maps.Map(mapElement, this.mapOptions);

    // Add marker for Musembe Market
    this.marker = new google.maps.Marker({
      position: { lat: 0.3036, lng: 34.7543 },
      map: this.map,
      title: 'Mzuri Organics - Musembe Market',
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'assets/images/marker-icon.png',
        scaledSize: new google.maps.Size(40, 40)
      }
    });

    // Create info window content
    const infoContent = `
      <div class="map-info-window">
        <h4 style="margin:0 0 8px; color:#1a2e1f;">📍 Mzuri Organics</h4>
        <p style="margin:0 0 5px; color:#5a6b5a;"><strong>Musembe Market</strong></p>
        <p style="margin:0 0 5px; color:#5a6b5a; font-size:13px;">Eldoret – Malaba Road</p>
        <p style="margin:0; color:#5a6b5a; font-size:13px;">Kakamega, Kenya</p>
        <hr style="margin:8px 0; border-color:#e8ede8;">
        <p style="margin:0; color:#88c431; font-size:12px;">📞 ${this.displayPhone}</p>
      </div>
    `;

    this.infoWindow = new google.maps.InfoWindow({
      content: infoContent
    });

    // Open info window by default
    this.infoWindow.open(this.map, this.marker);

    // Add click listener to marker
    this.marker.addListener('click', () => {
      this.infoWindow.open(this.map, this.marker);
    });
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

  copyAddress() {
    navigator.clipboard.writeText(this.location.address);
    alert('Address copied to clipboard!');
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
    // Add analytics tracking here
  }
}