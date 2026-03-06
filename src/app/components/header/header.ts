// src/app/components/header/header.component.ts
import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart';
import { AuthService, User } from '../../services/auth.service';
import { HamburgerMenuComponent } from '../hamburger-menu/hamburger-menu';

// Define interfaces at the top
interface NavItem {
  text: string;
  icon: string;
  route?: string;
  fragment?: string;
  children?: NavChild[];
}

interface NavChild {
  text: string;
  icon: string;
  route: string;
  fragment?: string;
  description: string;
}

interface SearchResult {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  route: string;
}

interface QuickAction {
  text: string;
  icon: string;
  tag: string;
}

interface AccountMenuItem {
  text: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HamburgerMenuComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('headerElement') headerElement!: ElementRef;

  // Header State
  isHeaderHidden = false;
  private lastScrollTop = 0;
  private hideTimeout: any;
  private mouseNearTop = false;

  // Menu States
  isQuickMenuOpen = false;
  isSettingsMenuOpen = false;
  isAccountMenuOpen = false;
  isSearchOpen = false;
  activeDropdown: number | null = null;
  
  // Mobile Menu State
  showMobileMenu = false;
  isMobileMenuOpen = false;

  // Header Settings
  autoHideEnabled = true;
  quickActionsEnabled = true;
  hideDelay = 300;
  scrollThreshold = 100;

  // Navigation
  navItems: NavItem[] = [
    { 
      text: 'Home', 
      icon: 'fas fa-home', 
      route: '/home' 
    },
    {
      text: 'About Us',
      icon: 'fas fa-info-circle',
      children: [
        { 
          text: 'Overview', 
          icon: 'fas fa-eye', 
          route: '/about', 
          description: 'Our mission and vision' 
        },
        { 
          text: 'What We Do', 
          icon: 'fas fa-hands-helping', 
          route: '/what-we-do', 
          description: 'Our innovative solutions' 
        },
        { 
          text: 'Challenges', 
          icon: 'fas fa-exclamation-triangle', 
          route: '/challenges', 
          description: 'Agricultural challenges we address' 
        },
        { 
          text: 'Impacts', 
          icon: 'fas fa-chart-line', 
          route: '/impacts', 
          description: 'Our significant environmental impact' 
        }
      ]
    },
    {
      text: 'Products',
      icon: 'fas fa-box-open',
      children: [
        { 
          text: 'Biofertilizers', 
          icon: 'fas fa-vial', 
          route: '/products', 
          description: 'Organic soil enhancers and plant nutrients' 
        },
        { 
          text: 'Animal Feeds', 
          icon: 'fas fa-paw', 
          route: '/products', 
          description: 'High-protein nutrition for livestock' 
        },
        { 
          text: 'Shop All', 
          icon: 'fas fa-shopping-bag', 
          route: '/products', 
          description: 'Complete catalog of organic products' 
        }
      ]
    },
    { 
      text: 'Contact', 
      icon: 'fas fa-envelope', 
      route: '/contact' 
    }
  ];

// Account Menu - Minimal
// Account Menu - Updated with proper icons
accountMenuItems: AccountMenuItem[] = [
  { 
    text: 'Blog', 
    icon: 'fas fa-newspaper',  // Changed from fa-envelope to fa-newspaper
    route: '/blog' 
  },
  { 
    text: 'FAQs', 
    icon: 'fas fa-question-circle', 
    route: '/faq'  // Changed from /faqs to /faq (singular)
  }
];
  // Search
  searchTerm = '';
  searchResults: SearchResult[] = [];
  quickActions: QuickAction[] = [
    { text: 'Fertilizers', icon: 'fas fa-flask', tag: 'Fertilizers' },
    { text: 'Feeds', icon: 'fas fa-paw', tag: 'Feeds' },
    { text: 'Avocados', icon: 'fas fa-seedling', tag: 'Avocados' }
  ];

  // Products
  private allProducts: SearchResult[] = [
    { id: 1, name: 'VermiFrass Active', description: 'Superior 100% organic fertilizer', price: 1500, category: 'Biofertilizers', image: 'images/product3.jpg', route: '/products' },
    { id: 2, name: 'NPK Active', description: 'Precision-engineered organo-mineral fertilizer', price: 2000, category: 'Fertilizers', image: 'images/product2.jpg', route: '/products' },
    { id: 3, name: 'i-Chick Mash', description: 'High-protein starter feed', price: 3200, category: 'Feeds', image: 'images/chick mash.jpeg', route: '/products' }
  ];

  // User & Cart
  currentUser: User | null = null;
  cartCount = 0;
  isDarkTheme = false;
  isCartOpen = false;

  // ============ ACCESSIBILITY SETTINGS ============
  fontSize: 'small' | 'medium' | 'large' = 'medium';
  highContrast = false;
  reducedMotion = false;
  lineSpacing: 'normal' | 'relaxed' | 'loose' = 'normal';
  letterSpacing: 'normal' | 'wide' | 'wider' = 'normal';
  readableFont = false;
  focusIndicators = false;

  private subscriptions: any[] = [];
  private dropdownTimeout: any;

  constructor(
    public cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.subscribeToServices();
    this.setupRouterListener();
    this.loadTheme();
    this.loadAccessibilitySettings(); // Add this line
    
    // Subscribe to cart open state
    this.subscriptions.push(
      this.cartService.isCartOpen$.subscribe(state => {
        this.isCartOpen = state;
      })
    );
    
    // Subscribe to cart state changes for header visibility
    this.subscriptions.push(
      this.cartService.isCartOpen$.subscribe(() => {
        if (this.cartService.getCartState()) {
          this.showHeader();
        }
      })
    );
  }

  // ============ ACCESSIBILITY METHODS ============
  
  // Font Size Methods
  increaseFontSize() {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(this.fontSize);
    if (currentIndex < sizes.length - 1) {
      this.fontSize = sizes[currentIndex + 1];
      this.applyFontSize();
      this.saveAccessibilitySettings();
    }
  }

  decreaseFontSize() {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(this.fontSize);
    if (currentIndex > 0) {
      this.fontSize = sizes[currentIndex - 1];
      this.applyFontSize();
      this.saveAccessibilitySettings();
    }
  }

  getFontSizeLabel(): string {
    const labels = {
      small: 'A-',
      medium: 'A',
      large: 'A+'
    };
    return labels[this.fontSize];
  }

  applyFontSize() {
    // Remove existing font size classes
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    // Add new font size class
    document.body.classList.add(`font-${this.fontSize}`);
  }

  // High Contrast
  toggleHighContrast() {
    if (this.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    this.saveAccessibilitySettings();
  }

  // Reduced Motion
  toggleReducedMotion() {
    if (this.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    this.saveAccessibilitySettings();
  }

  // Line Spacing
  updateLineSpacing() {
    document.body.classList.remove('line-spacing-normal', 'line-spacing-relaxed', 'line-spacing-loose');
    document.body.classList.add(`line-spacing-${this.lineSpacing}`);
    this.saveAccessibilitySettings();
  }

  // Letter Spacing
  updateLetterSpacing() {
    document.body.classList.remove('letter-spacing-normal', 'letter-spacing-wide', 'letter-spacing-wider');
    document.body.classList.add(`letter-spacing-${this.letterSpacing}`);
    this.saveAccessibilitySettings();
  }

  // Readable Font
  toggleReadableFont() {
    if (this.readableFont) {
      document.body.classList.add('readable-font');
    } else {
      document.body.classList.remove('readable-font');
    }
    this.saveAccessibilitySettings();
  }

  // Focus Indicators
  toggleFocusIndicators() {
    if (this.focusIndicators) {
      document.body.classList.add('focus-indicators');
    } else {
      document.body.classList.remove('focus-indicators');
    }
    this.saveAccessibilitySettings();
  }

  // Save/Load Accessibility Settings
  saveAccessibilitySettings() {
    const settings = {
      fontSize: this.fontSize,
      highContrast: this.highContrast,
      reducedMotion: this.reducedMotion,
      lineSpacing: this.lineSpacing,
      letterSpacing: this.letterSpacing,
      readableFont: this.readableFont,
      focusIndicators: this.focusIndicators
    };
    localStorage.setItem('mzuri_accessibility', JSON.stringify(settings));
  }

  loadAccessibilitySettings() {
    try {
      const saved = localStorage.getItem('mzuri_accessibility');
      if (saved) {
        const settings = JSON.parse(saved);
        this.fontSize = settings.fontSize || 'medium';
        this.highContrast = settings.highContrast || false;
        this.reducedMotion = settings.reducedMotion || false;
        this.lineSpacing = settings.lineSpacing || 'normal';
        this.letterSpacing = settings.letterSpacing || 'normal';
        this.readableFont = settings.readableFont || false;
        this.focusIndicators = settings.focusIndicators || false;
        
        // Apply all settings
        this.applyFontSize();
        if (this.highContrast) document.body.classList.add('high-contrast');
        if (this.reducedMotion) document.body.classList.add('reduced-motion');
        if (this.readableFont) document.body.classList.add('readable-font');
        if (this.focusIndicators) document.body.classList.add('focus-indicators');
        
        document.body.classList.add(`line-spacing-${this.lineSpacing}`);
        document.body.classList.add(`letter-spacing-${this.letterSpacing}`);
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  }

  resetAccessibilitySettings() {
    // Reset to defaults
    this.fontSize = 'medium';
    this.highContrast = false;
    this.reducedMotion = false;
    this.lineSpacing = 'normal';
    this.letterSpacing = 'normal';
    this.readableFont = false;
    this.focusIndicators = false;
    
    // Remove all accessibility classes
    document.body.classList.remove(
      'font-small', 'font-medium', 'font-large',
      'high-contrast', 'reduced-motion', 'readable-font',
      'focus-indicators', 'line-spacing-normal', 'line-spacing-relaxed',
      'line-spacing-loose', 'letter-spacing-normal', 'letter-spacing-wide',
      'letter-spacing-wider'
    );
    
    // Apply defaults
    this.applyFontSize();
    document.body.classList.add('line-spacing-normal', 'letter-spacing-normal');
    
    // Save settings
    this.saveAccessibilitySettings();
  }

  // Check if mobile screen
  get isMobileScreen(): boolean {
    return window.innerWidth <= 1024;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.showMobileMenu = this.isMobileMenuOpen;
  }

  onMenuToggle(isOpen: boolean) {
    this.isMobileMenuOpen = isOpen;
    this.showMobileMenu = isOpen;
  }

  // Handle screen resize
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 1024 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.showMobileMenu = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.dropdownTimeout) clearTimeout(this.dropdownTimeout);
  }

  // ============ CART FUNCTIONALITY ============
  toggleCart() {
    this.cartService.toggleCart();
    this.showHeader();
  }

  // ============ HEADER AUTO-HIDE ============
  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.autoHideEnabled) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = scrollTop > this.lastScrollTop;
    const atTop = scrollTop < 30;

    if (atTop) {
      this.showHeader();
      return;
    }

    if (scrollTop < this.lastScrollTop) {
      this.showHeader();
    } else if (scrollingDown && scrollTop > this.scrollThreshold) {
      if (this.mouseNearTop || this.isMenuOpen()) return;
      
      if (this.hideTimeout) clearTimeout(this.hideTimeout);
      
      this.hideTimeout = setTimeout(() => {
        this.hideHeader();
      }, this.hideDelay);
    }

    this.lastScrollTop = scrollTop;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseNearTop = event.clientY < 50;
    if (this.mouseNearTop && this.isHeaderHidden) {
      this.showHeader();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.mouseNearTop = false;
  }

  private showHeader() {
    if (this.isHeaderHidden) {
      this.isHeaderHidden = false;
      if (this.headerElement?.nativeElement) {
        this.renderer.removeClass(this.headerElement.nativeElement, 'header-hidden');
      }
    }
  }

  private hideHeader() {
    if (!this.isHeaderHidden && !this.isMenuOpen()) {
      this.isHeaderHidden = true;
      if (this.headerElement?.nativeElement) {
        this.renderer.addClass(this.headerElement.nativeElement, 'header-hidden');
      }
    }
  }

  private isMenuOpen(): boolean {
    return this.isQuickMenuOpen || this.isSettingsMenuOpen || 
           this.isAccountMenuOpen || this.isSearchOpen || 
           this.activeDropdown !== null || this.cartService.getCartState();
  }

  // ============ MENU CONTROLS ============
  toggleQuickMenu() {
    this.isQuickMenuOpen = !this.isQuickMenuOpen;
    if (this.isQuickMenuOpen) this.showHeader();
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
    if (this.isSettingsMenuOpen) this.showHeader();
  }

  toggleAccountMenu() {
    this.isAccountMenuOpen = !this.isAccountMenuOpen;
    if (this.isAccountMenuOpen) this.showHeader();
  }

  showDropdown(index: number) {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    
    this.activeDropdown = index;
    this.showHeader();
  }

  hideDropdown(index: number) {
    this.dropdownTimeout = setTimeout(() => {
      if (this.activeDropdown === index) {
        this.activeDropdown = null;
      }
    }, 150);
  }

  keepDropdownOpen(index: number) {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    
    this.activeDropdown = index;
  }

  toggleDropdown(index: number) {
    if (window.innerWidth <= 1024) {
      this.activeDropdown = this.activeDropdown === index ? null : index;
      this.showHeader();
    }
  }

  // ============ SETTINGS ============
  loadSettings() {
    try {
      const saved = localStorage.getItem('mzuri_header_settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.autoHideEnabled = settings.autoHideEnabled ?? true;
        this.quickActionsEnabled = settings.quickActionsEnabled ?? true;
        this.hideDelay = settings.hideDelay ?? 300;
        this.scrollThreshold = settings.scrollThreshold ?? 100;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  saveSettings() {
    try {
      const settings = {
        autoHideEnabled: this.autoHideEnabled,
        quickActionsEnabled: this.quickActionsEnabled,
        hideDelay: this.hideDelay,
        scrollThreshold: this.scrollThreshold
      };
      localStorage.setItem('mzuri_header_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  toggleAutoHide() {
    this.autoHideEnabled = !this.autoHideEnabled;
    this.saveSettings();
    if (!this.autoHideEnabled) this.showHeader();
  }

  resetSettings() {
    this.autoHideEnabled = true;
    this.quickActionsEnabled = true;
    this.hideDelay = 300;
    this.scrollThreshold = 100;
    this.saveSettings();
    this.showHeader();
  }

  // ============ THEME ============
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('mzuri-theme', this.isDarkTheme ? 'dark' : 'light');
    this.renderer[this.isDarkTheme ? 'addClass' : 'removeClass'](document.body, 'dark-theme');
  }

  loadTheme() {
    const saved = localStorage.getItem('mzuri-theme');
    this.isDarkTheme = saved === 'dark';
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }

  // ============ SEARCH ============
  openSearch() {
    this.isSearchOpen = true;
    this.renderer.addClass(document.body, 'search-open');
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      if (input) input.focus();
    }, 100);
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchTerm = '';
    this.searchResults = [];
    this.renderer.removeClass(document.body, 'search-open');
  }

  onSearchInput(event: any) {
    this.searchTerm = event.target.value;
    this.performSearch();
  }

  performSearch() {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.searchResults = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  searchByTag(action: QuickAction) {
    this.searchTerm = action.tag;
    this.performSearch();
  }

  goToProduct(product: SearchResult) {
    this.closeSearch();
    this.router.navigate([product.route]);
  }

  // ============ NAVIGATION ============
  isActive(route?: string): boolean {
    return route ? this.router.url === route : false;
  }

  navigateAndClose(child: NavChild) {
    if (child.fragment) {
      this.router.navigate([child.route], { fragment: child.fragment });
    } else {
      this.router.navigate([child.route]);
    }
    this.activeDropdown = null;
  }

  // ============ ACCOUNT ============
  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  logout() {
    this.authService.logout();
    this.toggleAccountMenu();
  }

  // ============ SERVICE SUBSCRIPTIONS ============
  private subscribeToServices() {
    // Subscribe to cart items count
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe((items: any[]) => {
        this.cartCount = items.reduce((total: number, item: any) => total + item.quantity, 0);
      })
    );
    
    // Subscribe to user auth state
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user: User | null) => {
        this.currentUser = user;
      })
    );
  }

  private setupRouterListener() {
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.activeDropdown = null;
        this.closeSearch();
      })
    );
  }

  // ============ EVENT LISTENERS ============
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.settings-menu') && !target.closest('.settings-icon')) {
      this.isSettingsMenuOpen = false;
    }
    
    if (!target.closest('.account-menu') && !target.closest('.account-icon')) {
      this.isAccountMenuOpen = false;
    }
    
    if (!target.closest('.dropdown') && !target.closest('.dropdown-toggle')) {
      this.activeDropdown = null;
    }
    
    if (!target.closest('.quick-menu') && !target.closest('.quick-menu-icon')) {
      this.isQuickMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.isSettingsMenuOpen = false;
    this.isAccountMenuOpen = false;
    this.isSearchOpen = false;
    this.activeDropdown = null;
    
    if (this.cartService.getCartState()) {
      this.cartService.closeCart();
    }
  }
}