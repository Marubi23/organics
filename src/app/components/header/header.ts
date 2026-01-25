import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart';
import { AuthService, User } from '../../services/auth.service';

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
  imports: [CommonModule, RouterModule, FormsModule],
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

  // Header Settings
  autoHideEnabled = true;
  quickActionsEnabled = true;
  hideDelay = 300;
  scrollThreshold = 100;

  // Navigation
  navItems: NavItem[] = [
    { text: 'Home', icon: 'fas fa-home', route: '/home' },
    {
      text: 'About Us',
      icon: 'fas fa-info-circle',
      children: [
        { text: 'Overview', icon: 'fas fa-eye', route: '/about', description: 'Our mission and values' },
        { text: 'Mission & Vision', icon: 'fas fa-bullseye', route: '/about', fragment: 'mission-vision', description: 'Goals and aspirations' },
        { text: 'Blog', icon: 'fas fa-newspaper', route: '/blog', description: 'Latest updates' },
        { text: 'FAQ', icon: 'fas fa-question-circle', route: '/faq', description: 'Common questions' }
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
    { text: 'Contact', icon: 'fas fa-envelope', route: '/contact' }
  ];

  // Account Menu
  accountMenuItems: AccountMenuItem[] = [
    { text: 'My Profile', icon: 'fas fa-user-circle', route: '/account/profile' },
    { text: 'Orders', icon: 'fas fa-shopping-bag', route: '/account/orders' },
    { text: 'Wishlist', icon: 'fas fa-heart', route: '/account/wishlist' },
    { text: 'Settings', icon: 'fas fa-cog', route: '/account/settings' },
    { text: 'Help Center', icon: 'fas fa-question-circle', route: '/help' }
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

  private subscriptions: any[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.loadSettings();
    this.subscribeToServices();
    this.setupRouterListener();
    this.loadTheme();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
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
      this.renderer.removeClass(this.headerElement?.nativeElement, 'header-hidden');
    }
  }

  private hideHeader() {
    if (!this.isHeaderHidden && !this.isMenuOpen()) {
      this.isHeaderHidden = true;
      this.renderer.addClass(this.headerElement?.nativeElement, 'header-hidden');
    }
  }

  private isMenuOpen(): boolean {
    return this.isQuickMenuOpen || this.isSettingsMenuOpen || 
           this.isAccountMenuOpen || this.isSearchOpen || 
           this.activeDropdown !== null;
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

  // ============ DROPDOWNS ============
  showDropdown(index: number) {
    this.activeDropdown = index;
    this.showHeader();
  }

  hideDropdown(index: number) {
    setTimeout(() => {
      if (this.activeDropdown === index) {
        this.activeDropdown = null;
      }
    }, 200);
  }

  keepDropdownOpen(index: number) {
    this.activeDropdown = index;
  }

  toggleDropdown(index: number) {
    this.activeDropdown = this.activeDropdown === index ? null : index;
    this.showHeader();
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

  // ============ CART ============
  toggleCart() {
    // Implement cart toggle logic
    console.log('Cart toggled');
  }

  // ============ SERVICE SUBSCRIPTIONS ============
  private subscribeToServices() {
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartCount = this.cartService.getTotalItems();
      })
    );
    
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
    
    this.cartService.loadFromLocalStorage();
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
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.isSettingsMenuOpen = false;
    this.isAccountMenuOpen = false;
    this.isSearchOpen = false;
    this.activeDropdown = null;
  }
}