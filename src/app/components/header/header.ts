import {
  Component, HostListener, OnInit, OnDestroy,
  ViewChild, ElementRef, Renderer2
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart';
import { AuthService, User } from '../../services/auth.service';
import { HamburgerMenuComponent } from '../hamburger-menu/hamburger-menu';
import { AccessibilityMenuComponent } from '../settings-menu/accessibility-menu';
import { AccountMenuComponent } from '../account-menu/account-menu';
import { SearchOverlayComponent } from '../search-overlay/search-overlay';

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

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HamburgerMenuComponent,
    AccessibilityMenuComponent,
    AccountMenuComponent,
    SearchOverlayComponent
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('headerElement') headerElement!: ElementRef;

  // Static navbar - no scroll effects
  isScrolled = false; // Keep as false, no scrolled class

  // Header State - DISABLED auto-hide
  isHeaderHidden = false; // Keep false, never hide

  // Menu States
  isQuickMenuOpen = false;
  isSettingsMenuOpen = false;
  isAccountMenuOpen = false;
  isAccountMenuComponentOpen = false;
  isSearchOpen = false;
  activeDropdown: number | null = null;
  showOverlay = false;
  showMobileMenu = false;
  isMobileMenuOpen = false;

  // Navigation
  navItems: NavItem[] = [
    { text: 'Home', icon: 'fas fa-store', route: '/home' },
    {
      text: 'About Us',
      icon: 'fas fa-globe',
      children: [
        { text: 'Overview', icon: 'fas fa-globe', route: '/about', description: 'Our mission and vision' },
        { text: 'What We Do', icon: 'fas fa-tools', route: '/what-we-do', description: 'Our innovative solutions' },
        { text: 'Challenges', icon: 'fas fa-balance-scale', route: '/challenges', description: 'Agricultural challenges we address' },
        { text: 'Impacts', icon: 'fas fa-tree', route: '/impacts', description: 'Our environmental impact' }
      ]
    },
    {
      text: 'Products',
      icon: 'fas fa-box-open',
      children: [
        { text: 'Biofertilizers', icon: 'fas fa-vial', route: '/products', description: 'Organic soil enhancers' },
 
        { text: 'Shop All', icon: 'fas fa-shopping-bag', route: '/products', description: 'Complete catalog' }
      ]
    },
    { text: 'Contact', icon: 'fas fa-envelope', route: '/contact' },
    { text: 'Testimonials', icon: 'fas fa-star', route: '/testimonials' }
  ];

  searchTerm = '';
  searchResults: SearchResult[] = [];
  quickActions: QuickAction[] = [
    { text: 'Fertilizers', icon: 'fas fa-flask', tag: 'Fertilizers' },
    { text: 'Feeds', icon: 'fas fa-paw', tag: 'Feeds' },
    { text: 'Avocados', icon: 'fas fa-seedling', tag: 'Avocados' }
  ];

  private allProducts: SearchResult[] = [
    { id: 1, name: 'VermiFrass Active', description: 'Superior 100% organic fertilizer', price: 1500, category: 'Biofertilizers', image: 'images/product3.jpg', route: '/products' },
    { id: 2, name: 'NPK Active', description: 'Precision-engineered organo-mineral fertilizer', price: 2000, category: 'Fertilizers', image: 'images/product2.jpg', route: '/products' },
    { id: 3, name: 'i-Chick Mash', description: 'High-protein starter feed', price: 3200, category: 'Feeds', image: 'images/chick mash.jpeg', route: '/products' }
  ];

  currentUser: User | null = null;
  cartCount = 0;
  isDarkTheme = false;
  isCartOpen = false;

  // Accessibility
  fontSize: 'small' | 'medium' | 'large' = 'medium';
  highContrast = false;
  reducedMotion = false;
  lineSpacing: 'normal' | 'relaxed' | 'loose' = 'normal';
  letterSpacing: 'normal' | 'wide' | 'wider' = 'normal';
  readableFont = false;
  focusIndicators = false;

  private subscriptions: any[] = [];
  private dropdownTimeout: any;
  private accountDropdownTimeout: any;

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
    this.loadAccessibilitySettings();

    this.subscriptions.push(
      this.cartService.isCartOpen$.subscribe(state => { this.isCartOpen = state; })
    );
    this.subscriptions.push(
      this.cartService.isCartOpen$.subscribe(() => {
        // No auto-hide behavior
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    if (this.dropdownTimeout) clearTimeout(this.dropdownTimeout);
    if (this.accountDropdownTimeout) clearTimeout(this.accountDropdownTimeout);
    this.renderer.removeClass(document.body, 'menu-open');
  }

  // Scroll handler - DISABLED (no action)
  @HostListener('window:scroll')
  onWindowScroll() {
    // DO NOTHING - navbar stays static
    return;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // DO NOTHING
    return;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    // DO NOTHING
    return;
  }

  // No show/hide header methods needed - always visible

  private isMenuOpen(): boolean {
    return this.isQuickMenuOpen || this.isSettingsMenuOpen ||
           this.isAccountMenuOpen || this.isAccountMenuComponentOpen ||
           this.isSearchOpen || this.activeDropdown !== null ||
           this.cartService.getCartState();
  }

  private showBlurOverlay() {
    this.showOverlay = true;
    this.renderer.addClass(document.body, 'menu-open');
  }

  private hideBlurOverlay() {
    if (!this.isSettingsMenuOpen && !this.isAccountMenuOpen &&
        !this.isAccountMenuComponentOpen && !this.isSearchOpen && !this.isQuickMenuOpen) {
      this.showOverlay = false;
      this.renderer.removeClass(document.body, 'menu-open');
    }
  }

  private updateOverlayState() {
    const anyOpen = this.isSettingsMenuOpen || this.isAccountMenuOpen ||
                    this.isAccountMenuComponentOpen || this.isSearchOpen || this.isQuickMenuOpen;
    anyOpen ? this.showBlurOverlay() : this.hideBlurOverlay();
  }

  toggleCart() { this.cartService.toggleCart(); }

  toggleQuickMenu() {
    this.isQuickMenuOpen = !this.isQuickMenuOpen;
    if (this.isQuickMenuOpen) { this.showBlurOverlay(); }
    else this.hideBlurOverlay();
    this.updateOverlayState();
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
    if (this.isSettingsMenuOpen) {
      this.showBlurOverlay();
      this.isAccountMenuOpen = false;
      this.isAccountMenuComponentOpen = false;
    } else this.hideBlurOverlay();
    this.updateOverlayState();
  }

  toggleAccountMenuComponent() {
    this.isAccountMenuComponentOpen = !this.isAccountMenuComponentOpen;
    if (this.isAccountMenuComponentOpen) {
      this.showBlurOverlay();
      this.isSettingsMenuOpen = false;
      this.isAccountMenuOpen = false;
    } else this.hideBlurOverlay();
    this.updateOverlayState();
  }

  openSearch() {
    this.isSearchOpen = true;
    this.showBlurOverlay();
    this.renderer.addClass(document.body, 'search-open');
    this.updateOverlayState();
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchTerm = '';
    this.searchResults = [];
    this.renderer.removeClass(document.body, 'search-open');
    this.hideBlurOverlay();
    this.updateOverlayState();
  }

  showAccountDropdown() {
    if (this.accountDropdownTimeout) { clearTimeout(this.accountDropdownTimeout); this.accountDropdownTimeout = null; }
    this.isAccountMenuOpen = true;
    this.showBlurOverlay();
    this.updateOverlayState();
  }

  hideAccountDropdown() {
    this.accountDropdownTimeout = setTimeout(() => {
      this.isAccountMenuOpen = false;
      this.hideBlurOverlay(); this.updateOverlayState();
    }, 200);
  }

  keepAccountDropdownOpen() {
    if (this.accountDropdownTimeout) { clearTimeout(this.accountDropdownTimeout); this.accountDropdownTimeout = null; }
    this.isAccountMenuOpen = true;
  }

  toggleAccountDropdown() {
    if (window.innerWidth <= 900) {
      this.isAccountMenuOpen = !this.isAccountMenuOpen;
      if (this.isAccountMenuOpen) { this.showBlurOverlay(); }
      else this.hideBlurOverlay();
      this.updateOverlayState();
    }
  }

  showDropdown(index: number) {
    if (this.dropdownTimeout) { clearTimeout(this.dropdownTimeout); this.dropdownTimeout = null; }
    this.activeDropdown = index;
  }

  hideDropdown(index: number) {
    this.dropdownTimeout = setTimeout(() => {
      if (this.activeDropdown === index) this.activeDropdown = null;
    }, 150);
  }

  keepDropdownOpen(index: number) {
    if (this.dropdownTimeout) { clearTimeout(this.dropdownTimeout); this.dropdownTimeout = null; }
    this.activeDropdown = index;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.showMobileMenu = this.isMobileMenuOpen;
    
    // Toggle the 'show' class on nav-links for mobile menu
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      if (this.isMobileMenuOpen) {
        navLinks.classList.add('show');
        this.renderer.addClass(document.body, 'menu-open');
      } else {
        navLinks.classList.remove('show');
        this.renderer.removeClass(document.body, 'menu-open');
      }
    }
    
    // Also handle any dropdowns that might be open
    if (!this.isMobileMenuOpen) {
      this.activeDropdown = null;
    }
  }

  onMenuToggle(isOpen: boolean) {
    this.isMobileMenuOpen = isOpen;
    this.showMobileMenu = isOpen;
    
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      if (isOpen) {
        navLinks.classList.add('show');
      } else {
        navLinks.classList.remove('show');
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 900 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      this.showMobileMenu = false;
      
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        navLinks.classList.remove('show');
      }
      this.renderer.removeClass(document.body, 'menu-open');
    }
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('mzuri_header_settings');
      if (saved) {
        const s = JSON.parse(saved);
        // Settings kept but auto-hide disabled
      }
    } catch {}
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('mzuri-theme', this.isDarkTheme ? 'dark' : 'light');
    this.renderer[this.isDarkTheme ? 'addClass' : 'removeClass'](document.body, 'dark-theme');
  }

  loadTheme() {
    const saved = localStorage.getItem('mzuri-theme');
    this.isDarkTheme = saved === 'dark';
    if (this.isDarkTheme) this.renderer.addClass(document.body, 'dark-theme');
  }

  increaseFontSize() {
    const sizes: ('small'|'medium'|'large')[] = ['small','medium','large'];
    const i = sizes.indexOf(this.fontSize);
    if (i < sizes.length - 1) { this.fontSize = sizes[i + 1]; this.applyFontSize(); this.saveAccessibilitySettings(); }
  }

  decreaseFontSize() {
    const sizes: ('small'|'medium'|'large')[] = ['small','medium','large'];
    const i = sizes.indexOf(this.fontSize);
    if (i > 0) { this.fontSize = sizes[i - 1]; this.applyFontSize(); this.saveAccessibilitySettings(); }
  }

  getFontSizeLabel(): string { return { small: 'A-', medium: 'A', large: 'A+' }[this.fontSize]; }
  applyFontSize() { document.body.classList.remove('font-small','font-medium','font-large'); document.body.classList.add(`font-${this.fontSize}`); }

  toggleHighContrast() { this.highContrast = !this.highContrast; this.renderer[this.highContrast ? 'addClass' : 'removeClass'](document.body, 'high-contrast'); this.saveAccessibilitySettings(); }
  toggleReducedMotion() { this.reducedMotion = !this.reducedMotion; this.renderer[this.reducedMotion ? 'addClass' : 'removeClass'](document.body, 'reduced-motion'); this.saveAccessibilitySettings(); }
  toggleReadableFont() { this.readableFont = !this.readableFont; this.renderer[this.readableFont ? 'addClass' : 'removeClass'](document.body, 'readable-font'); this.saveAccessibilitySettings(); }
  toggleFocusIndicators() { this.focusIndicators = !this.focusIndicators; this.renderer[this.focusIndicators ? 'addClass' : 'removeClass'](document.body, 'focus-indicators'); this.saveAccessibilitySettings(); }

  updateLineSpacing() { document.body.classList.remove('line-spacing-normal','line-spacing-relaxed','line-spacing-loose'); document.body.classList.add(`line-spacing-${this.lineSpacing}`); this.saveAccessibilitySettings(); }
  updateLetterSpacing() { document.body.classList.remove('letter-spacing-normal','letter-spacing-wide','letter-spacing-wider'); document.body.classList.add(`letter-spacing-${this.letterSpacing}`); this.saveAccessibilitySettings(); }

  saveAccessibilitySettings() {
    localStorage.setItem('mzuri_accessibility', JSON.stringify({
      fontSize: this.fontSize, highContrast: this.highContrast, reducedMotion: this.reducedMotion,
      lineSpacing: this.lineSpacing, letterSpacing: this.letterSpacing,
      readableFont: this.readableFont, focusIndicators: this.focusIndicators
    }));
  }

  loadAccessibilitySettings() {
    try {
      const saved = localStorage.getItem('mzuri_accessibility');
      if (saved) {
        const s = JSON.parse(saved);
        this.fontSize = s.fontSize || 'medium';
        this.highContrast = s.highContrast || false;
        this.reducedMotion = s.reducedMotion || false;
        this.lineSpacing = s.lineSpacing || 'normal';
        this.letterSpacing = s.letterSpacing || 'normal';
        this.readableFont = s.readableFont || false;
        this.focusIndicators = s.focusIndicators || false;
        this.applyFontSize();
        if (this.highContrast) document.body.classList.add('high-contrast');
        if (this.reducedMotion) document.body.classList.add('reduced-motion');
        if (this.readableFont) document.body.classList.add('readable-font');
        if (this.focusIndicators) document.body.classList.add('focus-indicators');
        document.body.classList.add(`line-spacing-${this.lineSpacing}`, `letter-spacing-${this.letterSpacing}`);
      }
    } catch {}
  }

  resetAccessibilitySettings() {
    this.fontSize = 'medium'; this.highContrast = false; this.reducedMotion = false;
    this.lineSpacing = 'normal'; this.letterSpacing = 'normal'; this.readableFont = false; this.focusIndicators = false;
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'high-contrast', 'reduced-motion', 'readable-font', 'focus-indicators', 'line-spacing-normal', 'line-spacing-relaxed', 'line-spacing-loose', 'letter-spacing-normal', 'letter-spacing-wide', 'letter-spacing-wider');
    this.applyFontSize();
    document.body.classList.add('line-spacing-normal', 'letter-spacing-normal');
    this.saveAccessibilitySettings();
  }

  get isMobileScreen(): boolean { return window.innerWidth <= 900; }

  onSearchInput(event: any) { this.searchTerm = event.target.value; this.performSearch(); }

  performSearch() {
    if (!this.searchTerm.trim()) { this.searchResults = []; return; }
    const t = this.searchTerm.toLowerCase().trim();
    this.searchResults = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)
    );
  }

  searchByTag(action: QuickAction) { this.searchTerm = action.tag; this.performSearch(); }
  goToProduct(product: SearchResult) { this.closeSearch(); this.router.navigate([product.route]); }

  isActive(route?: string): boolean { return route ? this.router.url === route : false; }

  navigateAndClose(child: NavChild) {
    child.fragment
      ? this.router.navigate([child.route], { fragment: child.fragment })
      : this.router.navigate([child.route]);
    this.activeDropdown = null;
    
    // Close mobile menu after navigation
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  navigateToPage(route: string) {
    this.router.navigate([route]);
    this.isAccountMenuOpen = false;
    this.closeSearch();
    
    // Close mobile menu after navigation
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
  }

  logout() {
    this.authService.logout();
    this.isAccountMenuOpen = false;
    this.isAccountMenuComponentOpen = false;
    this.hideBlurOverlay();
    this.updateOverlayState();
  }

  private subscribeToServices() {
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe((items: any[]) => {
        this.cartCount = items.reduce((t: number, i: any) => t + i.quantity, 0);
      })
    );
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user: User | null) => { this.currentUser = user; })
    );
  }

  private setupRouterListener() {
    this.subscriptions.push(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
        this.activeDropdown = null;
        this.closeSearch();
      })
    );
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const t = event.target as HTMLElement;
    if (!t.closest('.settings-menu') && !t.closest('[title="Accessibility settings"]')) { this.isSettingsMenuOpen = false; this.hideBlurOverlay(); }
    if (!t.closest('.account-dropdown') && !t.closest('.account-btn')) { this.isAccountMenuOpen = false; this.isAccountMenuComponentOpen = false; this.hideBlurOverlay(); }
    if (!t.closest('.nav-dropdown') && !t.closest('.dropdown-toggle')) this.activeDropdown = null;
    if (!t.closest('.quick-menu') && !t.closest('.quick-menu-icon')) { this.isQuickMenuOpen = false; this.hideBlurOverlay(); }
    this.updateOverlayState();
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.isSettingsMenuOpen = false; this.isAccountMenuOpen = false;
    this.isAccountMenuComponentOpen = false; this.isSearchOpen = false;
    this.isQuickMenuOpen = false; this.activeDropdown = null;
    this.hideBlurOverlay(); this.updateOverlayState();
    if (this.cartService.getCartState()) this.cartService.closeCart();
    
    // Close mobile menu on escape
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}