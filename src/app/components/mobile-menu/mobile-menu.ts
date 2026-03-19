import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  text: string;
  icon: string;
  route?: string;
  children?: NavChild[];
}

interface NavChild {
  text: string;
  icon: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-menu.html',
  styleUrls: ['./mobile-menu.css']
})
export class MobileMenuComponent implements OnInit {
  @Input() isOpen = false;
  @Input() currentUser: any = null;
  @Input() cartCount = 0;
  
  @Output() close = new EventEmitter<void>();
  @Output() openSearch = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();

  activeView: 'main' | 'account' | 'accessibility' = 'main';
  activeSubMenu: NavItem | null = null;

  navItems: NavItem[] = [
    { text: 'Home', icon: 'fas fa-home', route: '/home' },
    { 
      text: 'About Us', 
      icon: 'fas fa-info-circle',
      children: [
        { text: 'Overview', icon: 'fas fa-eye', route: '/about', description: 'Our mission and vision' },
        { text: 'What We Do', icon: 'fas fa-hands-helping', route: '/what-we-do', description: 'Our solutions' },
        { text: 'Challenges', icon: 'fas fa-exclamation-triangle', route: '/challenges', description: 'Agricultural challenges' },
        { text: 'Impacts', icon: 'fas fa-chart-line', route: '/impacts', description: 'Our environmental impact' },
        { text: 'Testimonials', icon: 'fas fa-star', route: '/testimonials', description: 'Customer stories' }
      ]
    },
    {
      text: 'Products',
      icon: 'fas fa-box-open',
      children: [
        { text: 'Biofertilizers', icon: 'fas fa-vial', route: '/products', description: 'Organic soil enhancers' },
        { text: 'Animal Feeds', icon: 'fas fa-paw', route: '/products', description: 'High-protein nutrition' },
        { text: 'Shop All', icon: 'fas fa-shopping-bag', route: '/products', description: 'Complete catalog' }
      ]
    },
    { text: 'Contact', icon: 'fas fa-envelope', route: '/contact' },
    { text: 'Blog', icon: 'fas fa-newspaper', route: '/blog' },
    { text: 'FAQs', icon: 'fas fa-question-circle', route: '/faq' }
  ];

  accountLinks = [
    { text: 'My Profile', icon: 'fas fa-user-circle', route: '/account/profile' },
    { text: 'My Orders', icon: 'fas fa-box', route: '/account/orders' },
    { text: 'Wishlist', icon: 'fas fa-heart', route: '/account/wishlist' },
    { text: 'Account Settings', icon: 'fas fa-cog', route: '/account/settings' },
    { text: 'Blog', icon: 'fas fa-newspaper', route: '/blog' },
    { text: 'FAQs', icon: 'fas fa-question-circle', route: '/faq' },
    { text: 'Testimonials', icon: 'fas fa-star', route: '/testimonials' }
  ];

  fontSize: 'small' | 'medium' | 'large' = 'medium';
  highContrast = false;
  reducedMotion = false;
  readableFont = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAccessibilitySettings();
  }

  closeMenu() {
    this.activeView = 'main';
    this.activeSubMenu = null;
    this.close.emit();
  }

  openSubMenu(item: NavItem) {
    this.activeSubMenu = item;
  }

  closeSubMenu() {
    this.activeSubMenu = null;
  }

  navigateTo(route: string | undefined) {
    if (route) {
      this.router.navigate([route]);
      this.closeMenu();
    }
  }

  navigateToChild(child: NavChild) {
    if (child.route) {
      this.router.navigate([child.route]);
      this.closeMenu();
    }
  }

  showAccount() {
    this.activeView = 'account';
  }

  showAccessibility() {
    this.activeView = 'accessibility';
  }

  goBack() {
    if (this.activeSubMenu) {
      this.activeSubMenu = null;
    } else {
      this.activeView = 'main';
    }
  }

  onSearchClick() {
    this.openSearch.emit();
    this.closeMenu();
  }

  onCartClick() {
    this.router.navigate(['/cart']);
    this.closeMenu();
  }

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'G';
    return this.currentUser.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }

  increaseFontSize() {
    const sizes = ['small', 'medium', 'large'] as const;
    const currentIndex = sizes.indexOf(this.fontSize);
    if (currentIndex < sizes.length - 1) {
      this.fontSize = sizes[currentIndex + 1];
      this.applyFontSize();
      this.saveSettings();
    }
  }

  decreaseFontSize() {
    const sizes = ['small', 'medium', 'large'] as const;
    const currentIndex = sizes.indexOf(this.fontSize);
    if (currentIndex > 0) {
      this.fontSize = sizes[currentIndex - 1];
      this.applyFontSize();
      this.saveSettings();
    }
  }

  getFontSizeLabel(): string {
    return {
      small: 'A-',
      medium: 'A',
      large: 'A+'
    }[this.fontSize];
  }

  applyFontSize() {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${this.fontSize}`);
  }

  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    if (this.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    this.saveSettings();
  }

  toggleReducedMotion() {
    this.reducedMotion = !this.reducedMotion;
    if (this.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    this.saveSettings();
  }

  toggleReadableFont() {
    this.readableFont = !this.readableFont;
    if (this.readableFont) {
      document.body.classList.add('readable-font');
    } else {
      document.body.classList.remove('readable-font');
    }
    this.saveSettings();
  }

  resetAccessibility() {
    this.fontSize = 'medium';
    this.highContrast = false;
    this.reducedMotion = false;
    this.readableFont = false;
    
    document.body.classList.remove(
      'font-small', 'font-large',
      'high-contrast', 'reduced-motion',
      'readable-font'
    );
    document.body.classList.add('font-medium');
    
    this.saveSettings();
  }

  private loadAccessibilitySettings() {
    try {
      const saved = localStorage.getItem('mzuri_accessibility');
      if (saved) {
        const settings = JSON.parse(saved);
        this.fontSize = settings.fontSize || 'medium';
        this.highContrast = settings.highContrast || false;
        this.reducedMotion = settings.reducedMotion || false;
        this.readableFont = settings.readableFont || false;
        
        this.applyFontSize();
        if (this.highContrast) document.body.classList.add('high-contrast');
        if (this.reducedMotion) document.body.classList.add('reduced-motion');
        if (this.readableFont) document.body.classList.add('readable-font');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  private saveSettings() {
    const settings = {
      fontSize: this.fontSize,
      highContrast: this.highContrast,
      reducedMotion: this.reducedMotion,
      readableFont: this.readableFont
    };
    localStorage.setItem('mzuri_accessibility', JSON.stringify(settings));
  }
}