import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';
import { AuthService, User } from '../../services/auth.service';

interface NavItem {
  text: string;
  icon: string;
  route?: string;
  fragment?: string;
  children?: NavChild[];
  footer?: NavFooter;
}

interface NavChild {
  text: string;
  icon: string;
  route: string;
  fragment?: string;
  description: string;
}

interface NavFooter {
  text: string;
  route: string;
}

interface SearchResult {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  route: string;
  isOrganic?: boolean;
  inStock?: boolean;
  rating?: number;
  tags?: string[];
}

interface LogoParticle {
  x: number;
  y: number;
  delay: number;
  size: number;
}

interface FloatingOrb {
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
}

interface QuickAction {
  text: string;
  icon: string;
  tag: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CartComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // State Management
  cartCount = 0;
  isMobileMenuOpen = false;
  isCartOpen = false;
  isSearchOpen = false;
  isUserPanelOpen = false;
  isListening = false;
  isDarkTheme = false;
  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'success';
  notificationIcon = '';

  // Navigation Data
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
          description: 'Our mission and values'
        },
        {
          text: 'Mission & Vision',
          icon: 'fas fa-bullseye',
          route: '/about',
          fragment: 'mission-vision',
          description: 'Goals and aspirations'
        },
        {
          text: 'Blog',
          icon: 'fas fa-newspaper',
          route: '/blog',
          description: 'Latest updates'
        },
        {
          text: 'FAQ',
          icon: 'fas fa-question-circle',
          route: '/faq',
          description: 'Common questions'
        }
      ],
      footer: {
        text: 'View All About',
        route: '/about'
      }
    },
    {
      text: 'What We Do',
      icon: 'fas fa-hands-helping',
      children: [
        {
          text: 'The Problems',
          icon: 'fas fa-exclamation-triangle',
          route: '/challenges',
          description: 'Agricultural challenges'
        },
        {
          text: 'Circular Model',
          icon: 'fas fa-recycle',
          route: '/what-we-do',
          fragment: 'circular-model',
          description: 'Sustainable system'
        },
        {
          text: 'PREFarm Initiative',
          icon: 'fas fa-tachometer-alt',
          route: '/what-we-do',
          fragment: 'prefarm-initiative',
          description: 'Precision farming'
        },
        {
          text: 'Regen-Kilimo',
          icon: 'fas fa-seedling',
          route: '/what-we-do',
          fragment: 'regen-kilimo',
          description: 'Regenerative agriculture'
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
          description: 'Organic soil enhancers'
        },
        {
          text: 'Animal Feeds',
          icon: 'fas fa-paw',
          route: '/products',
          description: 'High-protein nutrition'
        },
        {
          text: 'Shop All',
          icon: 'fas fa-shopping-bag',
          route: '/products',
          description: 'Complete catalog'
        },
        {
          text: 'Compost',
          icon: 'fas fa-recycle',
          route: '/products',
          fragment: 'compost',
          description: 'Soil amendments'
        }
      ]
    },
    {
      text: 'Impact',
      icon: 'fas fa-chart-line',
      children: [
        {
          text: 'Overview',
          icon: 'fas fa-chart-bar',
          route: '/impacts',
          description: 'Our impact at a glance'
        },
        {
          text: 'Metrics',
          icon: 'fas fa-chart-pie',
          route: '/impacts',
          fragment: 'metrics',
          description: 'Data-driven results'
        },
        {
          text: 'SDG Alignment',
          icon: 'fas fa-globe-africa',
          route: '/impacts',
          fragment: 'sdg',
          description: 'UN Goals'
        }
      ]
    },
    {
      text: 'Contact',
      icon: 'fas fa-envelope',
      route: '/contact'
    }
  ];

  // Search Functionality
  searchTerm = '';
  searchResults: SearchResult[] = [];
  searchLayout: 'grid' | 'list' | 'hologram' = 'hologram';
  recentSearches: string[] = [];
  quickActions: QuickAction[] = [
    { text: 'Fertilizers', icon: 'fas fa-flask', tag: 'Fertilizers' },
    { text: 'Animal Feeds', icon: 'fas fa-paw', tag: 'Feeds' },
    { text: 'BSF Larvae', icon: 'fas fa-worm', tag: 'BSF Larvae' },
    { text: 'Avocados', icon: 'fas fa-seedling', tag: 'Avocados' }
  ];
  featuredProducts: SearchResult[] = [];

  // Visual Effects
  logoParticles: LogoParticle[] = [];
  floatingOrbs: FloatingOrb[] = [];
  activeDropdown: number | null = null;
  openMobileDropdown: string | null = null;
  dropdownTimeout: any;

  // Authentication
  currentUser: User | null = null;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('voiceSearch') voiceSearch!: ElementRef;

  private cartSubscription: any;
  private authSubscription: any;
  private routerSubscription: any;

  // Product Database
  public allProducts: SearchResult[] = [
    {
      id: 1,
      name: 'VermiFrass Active',
      description: 'Superior 100% organic fertilizer with active macrobes and microbes',
      price: 1500,
      category: 'Organic Biofertilizers',
      image: 'images/product3.jpg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.9,
      tags: ['fertilizer', 'organic', 'bio']
    },
    {
      id: 2,
      name: 'NPK Active',
      description: 'Precision-engineered organo-mineral fertilizer',
      price: 2000,
      category: 'Blended Fertilizers',
      image: 'images/product2.jpg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.8,
      tags: ['fertilizer', 'npk', 'organic']
    },
    {
      id: 3,
      name: 'i-Chick Mash',
      description: 'High-protein starter feed for chicks',
      price: 3200,
      category: 'Poultry Feeds',
      image: 'images/chick mash.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.7,
      tags: ['feed', 'poultry', 'animal']
    },
    {
      id: 4,
      name: 'Organic Avocados',
      description: 'Fresh Hass avocados from Kenyan highlands',
      price: 120,
      category: 'Fruits',
      image: 'images/avacado.jpg',
      route: '/shop',
      isOrganic: true,
      inStock: true,
      rating: 4.9,
      tags: ['avocado', 'fruit', 'organic']
    },
    {
      id: 5,
      name: 'Red Wigglers',
      description: 'Composting worms for vermiculture',
      price: 3000,
      category: 'Agricultural Inputs',
      image: 'images/red-wigglers.jpg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.6,
      tags: ['worms', 'compost', 'organic']
    }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.initVisualEffects();
    this.loadRecentSearches();
    this.initializeFeaturedProducts();
    
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = this.cartService.getTotalItems();
    });
    this.cartService.loadFromLocalStorage();
    
    // Subscribe to auth updates
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Subscribe to router events
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeAllDropdowns();
    });
    
    // Load theme preference
    this.loadTheme();
  }

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
    if (this.dropdownTimeout) clearTimeout(this.dropdownTimeout);
  }

  // ============ VISUAL EFFECTS ============
  initVisualEffects() {
    // Create logo particles
    for (let i = 0; i < 8; i++) {
      this.logoParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 4 + 2
      });
    }

    // Create floating orbs
    for (let i = 0; i < 15; i++) {
      this.floatingOrbs.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 100 + 50,
        delay: Math.random() * 5,
        speed: Math.random() * 0.5 + 0.2
      });
    }
  }

  // ============ DROPDOWN MANAGEMENT ============
showDropdown(index: number, element: HTMLElement) {
  this.activeDropdown = index;
}


hideDropdown(index: number, element: HTMLElement) {
  // Add a small delay to prevent flickering
  setTimeout(() => {
    if (this.activeDropdown === index) {
      this.activeDropdown = null;
    }
  }, 300);
}
keepDropdownOpen(index: number) {
  this.activeDropdown = index;
}

  closeAllDropdowns() {
    this.activeDropdown = null;
    this.openMobileDropdown = null;
  }

  getDropdownDescription(index: number): string {
    const descriptions = [
      'Learn about our mission and vision',
      'Discover our sustainable solutions',
      'Explore our organic products',
      'See our impact and achievements'
    ];
    return descriptions[index - 1] || 'Explore our offerings';
  }

  // ============ NAVIGATION ============
  isActive(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route;
  }

  navigateAndClose(child: NavChild) {
    if (child.fragment) {
      this.router.navigate([child.route], { fragment: child.fragment });
    } else {
      this.router.navigate([child.route]);
    }
    this.closeAllDropdowns();
  }

  toggleMobileDropdown(navItem: NavItem) {
    if (this.openMobileDropdown === navItem.text) {
      this.openMobileDropdown = null;
    } else {
      this.openMobileDropdown = navItem.text;
    }
  }

  // ============ SEARCH FUNCTIONALITY ============
  openSearch() {
    this.isSearchOpen = true;
    document.body.style.overflow = 'hidden';
    this.renderer.addClass(document.body, 'search-open');
    
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 300);
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchTerm = '';
    this.searchResults = [];
    document.body.style.overflow = '';
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
    this.searchResults = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.tags?.some(tag => tag.toLowerCase().includes(term))
    );
    
    // Add to recent searches
    if (term.length > 2 && !this.recentSearches.includes(term)) {
      this.addToRecentSearches(term);
    }
  }

  searchByTag(tag: string | QuickAction) {
    if (typeof tag === 'string') {
      this.searchTerm = tag;
    } else {
      this.searchTerm = tag.tag;
    }
    this.performSearch();
    this.animateSearchAction();
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  setSearchLayout(layout: 'grid' | 'list' | 'hologram') {
    this.searchLayout = layout;
  }

  // ============ VOICE SEARCH ============
  toggleVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      this.isListening = !this.isListening;
      
      if (this.isListening) {
        this.startVoiceRecognition();
      } else {
        this.stopVoiceRecognition();
      }
    } else {
      this.showNotificationMessage(
        'Voice search not supported in your browser',
        'error',
        'fas fa-microphone-slash'
      );
    }
  }

  startVoiceRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                              (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.searchTerm = transcript;
        this.performSearch();
        this.isListening = false;
      };

      recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        this.isListening = false;
        this.showNotificationMessage(
          'Voice recognition failed. Try again.',
          'error',
          'fas fa-exclamation-triangle'
        );
      };

      recognition.start();
    }
  }

  stopVoiceRecognition() {
    this.isListening = false;
  }

  // ============ THEME MANAGEMENT ============
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.saveTheme();
    
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.showNotificationMessage(
        'Dark theme activated',
        'success',
        'fas fa-moon'
      );
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.showNotificationMessage(
        'Light theme activated',
        'success',
        'fas fa-sun'
      );
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('mzuri-theme');
    this.isDarkTheme = savedTheme === 'dark';
    
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }

  saveTheme() {
    localStorage.setItem('mzuri-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  // ============ NOTIFICATIONS ============
  showNotificationMessage(message: string, type: 'success' | 'error' | 'info', icon: string) {
    this.notificationMessage = message;
    this.notificationType = type;
    this.notificationIcon = icon;
    this.showNotification = true;

    setTimeout(() => {
      this.hideNotification();
    }, 4000);
  }

  hideNotification() {
    this.showNotification = false;
  }

  // ============ ANIMATIONS ============
  animateSearchAction() {
    const container = document.querySelector('.search-input-wrapper');
    if (container) {
      this.renderer.addClass(container, 'searching');
      setTimeout(() => {
        this.renderer.removeClass(container, 'searching');
      }, 1000);
    }
  }

  // ============ CART FUNCTIONALITY ============
  addToCartFromSearch(product: SearchResult) {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      units: '1 unit',
      quantity: 1
    };
    
    this.cartService.addToCart(cartItem);
    this.showNotificationMessage(
      `${product.name} added to cart!`,
      'success',
      'fas fa-cart-plus'
    );
    this.animateAddToCart(product);
  }

  animateAddToCart(product: SearchResult) {
    const button = document.querySelector(`[data-product-id="${product.id}"]`);
    if (button) {
      const rect = button.getBoundingClientRect();
      const cartBtn = document.querySelector('.cart-btn');
      
      if (cartBtn) {
        const cartRect = cartBtn.getBoundingClientRect();
        
        const flyingElement = document.createElement('div');
        flyingElement.className = 'flying-cart-item';
        flyingElement.innerHTML = `<i class="fas fa-shopping-cart"></i>`;
        flyingElement.style.left = `${rect.left}px`;
        flyingElement.style.top = `${rect.top}px`;
        
        document.body.appendChild(flyingElement);
        
        setTimeout(() => {
          flyingElement.style.left = `${cartRect.left}px`;
          flyingElement.style.top = `${cartRect.top}px`;
          flyingElement.style.transform = 'scale(0.5)';
          flyingElement.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
          if (document.body.contains(flyingElement)) {
            document.body.removeChild(flyingElement);
          }
        }, 1000);
      }
    }
  }

  // ============ RECENT SEARCHES ============
  loadRecentSearches() {
    try {
      const saved = localStorage.getItem('mzuri_recent_searches');
      if (saved) {
        this.recentSearches = JSON.parse(saved);
      }
    } catch (error) {
      this.recentSearches = ['NPK Fertilizer', 'BSF Larvae', 'Avocados'];
    }
  }

  saveRecentSearches() {
    try {
      localStorage.setItem('mzuri_recent_searches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }

  addToRecentSearches(term: string) {
    const index = this.recentSearches.indexOf(term);
    if (index > -1) {
      this.recentSearches.splice(index, 1);
    }
    
    this.recentSearches.unshift(term);
    
    if (this.recentSearches.length > 8) {
      this.recentSearches.pop();
    }
    
    this.saveRecentSearches();
  }

  // ============ UTILITIES ============
  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getUserFirstName(): string {
    if (!this.currentUser?.fullName) return 'User';
    return this.currentUser.fullName.split(' ')[0];
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    
    if (this.isMobileMenuOpen) {
      this.renderer.addClass(document.body, 'mobile-menu-open');
    } else {
      this.renderer.removeClass(document.body, 'mobile-menu-open');
      this.openMobileDropdown = null;
    }
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    document.body.style.overflow = this.isCartOpen ? 'hidden' : '';
  }

  toggleUserPanel() {
    this.isUserPanelOpen = !this.isUserPanelOpen;
  }

  initializeFeaturedProducts() {
    this.featuredProducts = [
      this.allProducts.find(p => p.id === 1)!,
      this.allProducts.find(p => p.id === 2)!,
      this.allProducts.find(p => p.id === 3)!,
      this.allProducts.find(p => p.id === 4)!
    ].filter(p => p !== undefined);
  }

  handleImageError(event: any) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x200?text=Mzuri+Organic';
  }

  // ============ EVENT LISTENERS ============
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    if (this.isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-menu')) {
      this.toggleMobileMenu();
    }
    
    if (this.isCartOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-btn')) {
      this.toggleCart();
    }
    
    if (this.isSearchOpen && target.classList.contains('search-overlay')) {
      this.closeSearch();
    }
    
    if (this.isUserPanelOpen && !target.closest('.user-panel') && !target.closest('.user-avatar-btn')) {
      this.toggleUserPanel();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.isMobileMenuOpen) this.toggleMobileMenu();
    if (this.isCartOpen) this.toggleCart();
    if (this.isSearchOpen) this.closeSearch();
    if (this.isUserPanelOpen) this.toggleUserPanel();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 968 && this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}