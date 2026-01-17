import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';
import { AuthService, User } from '../../services/auth.service';

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
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isMobileMenuOpen = false;
  isCartOpen = false;
  isSearchOpen = false;
  searchTerm = '';
  searchResults: SearchResult[] = [];
  searchLayout: 'grid' | 'list' | 'compact' | 'cards' = 'grid';
  searchCategoryFilter: string = '';
  
  // Recent searches functionality
  recentSearches: string[] = ['NPK Fertilizer', 'BSF Larvae', 'Avocados', 'Animal Feeds'];
  
  // Featured products for suggestions
  featuredProducts: SearchResult[] = [];
  
  // Authentication properties
  currentUser: User | null = null;
  
  @ViewChild('searchInput') searchInput!: ElementRef;

  private cartSubscription: any;
  private authSubscription: any;

  // Enhanced product data with all categories
  public allProducts: SearchResult[] = [
    // Biofertilizers
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
      rating: 4.9
    },
    {
      id: 2,
      name: 'BioVeg Plus',
      description: 'Specialized organic fertilizer for vegetables',
      price: 920,
      category: 'Organic Biofertilizers',
      image: 'images/bio veg.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.7
    },
    {
      id: 3,
      name: 'BioFruity Plus',
      description: 'Premium organic fertilizer for fruit trees and vines',
      price: 700,
      category: 'Organic Biofertilizers',
      image: 'images/product1.jpg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.8
    },
    {
      id: 4,
      name: 'Liquid Frass',
      description: 'Concentrated liquid fertilizer from BSFL frass',
      price: 700,
      category: 'Organic Biofertilizers',
      image: 'images/liquid frass.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.6
    },

    // Blended Fertilizers
    {
      id: 5,
      name: 'NPK Active',
      description: 'Precision-engineered organo-mineral fertilizer',
      price: 2000,
      category: 'Blended Fertilizers',
      image: 'images/product2.jpg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.9
    },

    // Poultry Feeds
    {
      id: 6,
      name: 'i-Chick Mash',
      description: 'High-protein starter feed for chicks',
      price: 3200,
      category: 'Poultry Feeds',
      image: 'images/chick mash.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.8
    },
    {
      id: 7,
      name: 'i-Growers Mash',
      description: 'Balanced grower feed for developing chickens',
      price: 2900,
      category: 'Poultry Feeds',
      image: 'images/growers mash.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.7
    },
    {
      id: 8,
      name: 'i-Broilers Mash',
      description: 'High-energy feed for broiler chickens',
      price: 3100,
      category: 'Poultry Feeds',
      image: 'images/broiler mash.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.8
    },
    {
      id: 9,
      name: 'i-Layers Mash',
      description: 'Specialized feed for laying hens',
      price: 3000,
      category: 'Poultry Feeds',
      image: 'images/layers mash.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.9
    },

    // Pig Feeds
    {
      id: 10,
      name: 'i-Pig Creep Pellets',
      description: 'High-protein starter feed for piglets',
      price: 3800,
      category: 'Pig Feeds',
      image: 'images/pig creepers.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.7
    },
    {
      id: 11,
      name: 'i-Pig Sow & Weaner',
      description: 'Balanced feed for sows and weaners',
      price: 3500,
      category: 'Pig Feeds',
      image: 'images/pig weaner.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.6
    },
    {
      id: 12,
      name: 'i-Pig Finisher',
      description: 'High-energy feed for finishing pigs',
      price: 3300,
      category: 'Pig Feeds',
      image: 'images/pig finisher.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.8
    },

    // Pet Foods
    {
      id: 13,
      name: 'i-Dig Treats',
      description: 'Nutritious treats for dogs made from BSFL protein',
      price: 950,
      category: 'Pet Foods',
      image: 'images/dog food.jpeg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.9
    },

    // Fruits & Vegetables
    {
      id: 14,
      name: 'Organic Avocados',
      description: 'Fresh Hass avocados from Kenyan highlands',
      price: 120,
      category: 'Fruits',
      image: 'images/avacado.jpg',
      route: '/shop',
      isOrganic: true,
      inStock: true,
      rating: 4.8
    },
    {
      id: 15,
      name: 'Organic Kale',
      description: 'Fresh kale bundle from certified organic farms',
      price: 180,
      category: 'Vegetables',
      image: 'images/kales.jpg',
      route: '/shop',
      isOrganic: true,
      inStock: true,
      rating: 4.7
    },
    {
      id: 16,
      name: 'Red Wigglers',
      description: 'Composting worms for vermiculture',
      price: 3000,
      category: 'Agricultural Inputs',
      image: 'images/red-wigglers.jpg',
      route: '/products',
      isOrganic: true,
      inStock: true,
      rating: 4.6
    }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {
    // Debug router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Router NavigationEnd:', event.url);
      }
    });
  }

  ngOnInit() {
    console.log('HeaderComponent initialized');
    
    // Load recent searches from localStorage
    this.loadRecentSearches();
    
    // Initialize featured products
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
    
    // Fragment navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Fragment navigation handling URL:', event.url);
      this.handleFragmentNavigation(event.url);
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // ============= SEARCH FUNCTIONALITY =============

  openSearch() {
    console.log('Opening magnificent sidebar search');
    this.isSearchOpen = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 100);
  }

  closeSearch() {
    console.log('Closing search');
    this.isSearchOpen = false;
    this.searchTerm = '';
    this.searchResults = [];
    document.body.style.overflow = '';
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
      product.category.toLowerCase().includes(term)
    );
    
    // Add to recent searches if not empty
    if (term.length > 2 && !this.recentSearches.includes(term)) {
      this.addToRecentSearches(term);
    }
  }

  searchByTag(tag: string) {
    console.log('Search by tag:', tag);
    this.searchTerm = tag;
    this.performSearch();
    if (this.searchInput) {
      this.searchInput.nativeElement.value = tag;
      this.searchInput.nativeElement.focus();
    }
    
    // Add to recent searches
    this.addToRecentSearches(tag);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.focus();
    }
  }

  setSearchLayout(layout: 'grid' | 'list' | 'compact' | 'cards') {
    this.searchLayout = layout;
  }

  initializeFeaturedProducts() {
    this.featuredProducts = [
      this.allProducts.find(p => p.id === 1)!,
      this.allProducts.find(p => p.id === 6)!,
      this.allProducts.find(p => p.id === 14)!,
      this.allProducts.find(p => p.id === 5)!,
      this.allProducts.find(p => p.id === 13)!,
      this.allProducts.find(p => p.id === 16)!,
    ].filter(p => p !== undefined);
  }

  navigateToSearchResult(result: SearchResult) {
    console.log('Navigating to search result:', result.route);
    this.closeSearch();
    this.router.navigate([result.route]);
  }

  addToCartFromSearch(product: SearchResult, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
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
    this.showToast(`${product.name} added to cart!`);
    this.animateAddToCart(product);
  }

  handleImageError(event: any) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/300x200?text=Mzuri+Organic';
  }

  // ============= RECENT SEARCHES MANAGEMENT =============

  private loadRecentSearches() {
    try {
      const saved = localStorage.getItem('mzuri_recent_searches');
      if (saved) {
        this.recentSearches = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
      this.recentSearches = ['NPK Fertilizer', 'BSF Larvae', 'Avocados', 'Animal Feeds'];
    }
  }

  private saveRecentSearches() {
    try {
      localStorage.setItem('mzuri_recent_searches', JSON.stringify(this.recentSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }

  private addToRecentSearches(searchTerm: string) {
    // Remove if already exists
    const index = this.recentSearches.indexOf(searchTerm);
    if (index > -1) {
      this.recentSearches.splice(index, 1);
    }
    
    // Add to beginning
    this.recentSearches.unshift(searchTerm);
    
    // Keep only last 10 searches
    if (this.recentSearches.length > 10) {
      this.recentSearches.pop();
    }
    
    // Save to localStorage
    this.saveRecentSearches();
  }

  removeRecentSearch(searchTerm: string, event: Event) {
    event.stopPropagation();
    const index = this.recentSearches.indexOf(searchTerm);
    if (index > -1) {
      this.recentSearches.splice(index, 1);
      this.saveRecentSearches();
    }
  }

  clearAllRecentSearches() {
    this.recentSearches = [];
    this.saveRecentSearches();
  }

  // ============= HELPER METHODS =============

  // Simple truncate method for text display
  truncateText(text: string, limit: number = 60): string {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substr(0, limit) + '...';
  }

  private showToast(message: string) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'search-toast';
    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  private animateAddToCart(product: SearchResult) {
    // Find the button that was clicked
    const buttons = document.querySelectorAll('.card-action-btn');
    const clickedButton = Array.from(buttons).find(btn => 
      btn.closest('.card-item-search')?.querySelector('.card-title-search')?.textContent?.includes(product.name)
    ) as HTMLElement;
    
    if (!clickedButton) return;
    
    // Create a flying element
    const flyingElement = document.createElement('div');
    flyingElement.className = 'flying-item-search';
    flyingElement.innerHTML = `<i class="fas fa-shopping-cart"></i>`;
    
    // Get button position
    const buttonRect = clickedButton.getBoundingClientRect();
    flyingElement.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
    flyingElement.style.top = `${buttonRect.top + buttonRect.height / 2}px`;
    
    // Add to body
    document.body.appendChild(flyingElement);
    
    // Get cart position (header cart button)
    const cartButton = document.querySelector('.cart-btn') as HTMLElement;
    if (!cartButton) return;
    
    const cartRect = cartButton.getBoundingClientRect();
    const cartX = cartRect.left + cartRect.width / 2;
    const cartY = cartRect.top + cartRect.height / 2;
    
    // Animate to cart
    setTimeout(() => {
      flyingElement.style.transform = `translate(${cartX - buttonRect.left}px, ${cartY - buttonRect.top}px) scale(0.3)`;
      flyingElement.style.opacity = '0';
      
      // Pulse the cart button
      cartButton.classList.add('cart-pulse');
      
      setTimeout(() => {
        cartButton.classList.remove('cart-pulse');
      }, 500);
    }, 10);
    
    // Remove flying element after animation
    setTimeout(() => {
      if (document.body.contains(flyingElement)) {
        document.body.removeChild(flyingElement);
      }
    }, 1000);
  }

  // ============= FRAGMENT NAVIGATION METHODS =============

  private handleFragmentNavigation(url: string): void {
    const fragment = this.router.parseUrl(url).fragment;
    if (fragment) {
      setTimeout(() => {
        this.scrollToFragment(fragment);
      }, 100);
    }
  }

  private scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToSection(sectionId: string): void {
    console.log('scrollToSection called:', sectionId);
    
    if (window.location.pathname.includes('/impacts')) {
      window.dispatchEvent(new CustomEvent('scrollToImpactSection', {
        detail: { sectionId }
      }));
      
      window.history.replaceState(null, '', `/impacts#${sectionId}`);
      
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.style.overflow = '';
      }
    } else {
      this.router.navigate(['/impacts']).then(() => {
        console.log('Navigated to impacts page');
        if (this.isMobileMenuOpen) {
          this.isMobileMenuOpen = false;
          document.body.style.overflow = '';
        }
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('scrollToImpactSection', {
            detail: { sectionId }
          }));
        }, 500);
      });
    }
  }

  navigateWithFragment(route: string, fragment: string): void {
    this.router.navigate([route], { fragment: fragment }).then(() => {
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.style.overflow = '';
      }
    });
  }

  navigateToAboutWithFragment(fragment: string): void {
    this.router.navigate(['/about'], { fragment: fragment });
  }

  // ============= EXISTING METHODS =============

  toggleCart() {
    console.log('Toggling cart, current state:', this.isCartOpen);
    this.isCartOpen = !this.isCartOpen;
    document.body.style.overflow = this.isCartOpen ? 'hidden' : '';
  }

  toggleMobileMenu() {
    console.log('Toggling mobile menu, current state:', this.isMobileMenuOpen);
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  toggleMobileDropdown(event: Event) {
    console.log('Toggling mobile dropdown');
    event.preventDefault();
    event.stopPropagation();
    
    const dropdown = (event.target as HTMLElement).closest('.mobile-dropdown');
    const menu = dropdown?.querySelector('.mobile-dropdown-menu');
    const toggle = dropdown?.querySelector('.mobile-dropdown-toggle');
    
    if (menu && toggle) {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Close mobile menu if clicked outside
    if (this.isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-menu')) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
    
    // Close cart if clicked outside
    if (this.isCartOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-btn')) {
      this.isCartOpen = false;
      document.body.style.overflow = '';
    }

    // Close search if clicked outside (clicking on overlay)
    if (this.isSearchOpen && target.classList.contains('search-overlay')) {
      this.closeSearch();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    console.log('Escape key pressed');
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
    if (this.isCartOpen) {
      this.isCartOpen = false;
      document.body.style.overflow = '';
    }
    if (this.isSearchOpen) {
      this.closeSearch();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const window = event.target as Window;
    if (window.innerWidth > 968) {
      if (this.isMobileMenuOpen) {
        this.isMobileMenuOpen = false;
        document.body.style.overflow = '';
      }
    }
  }

  // Helper method to get user initials (with null check)
  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Helper method to get user first name (with null check)
  getUserFirstName(): string {
    if (!this.currentUser?.fullName) return 'User';
    return this.currentUser.fullName.split(' ')[0];
  }

  // Safe method to get user county
  getUserCounty(): string {
    return this.currentUser?.county || '';
  }

  // Safe method to get user phone number
  getUserPhoneNumber(): string {
    return this.currentUser?.phoneNumber || '';
  }

  // ============= DEBUGGING METHODS =============
  
  testNavigation() {
    console.log('=== TEST NAVIGATION ===');
    console.log('1. Current router URL:', this.router.url);
    console.log('2. Window location:', window.location.href);
    console.log('3. Current path:', window.location.pathname);
    
    // Test direct navigation
    this.router.navigate(['/home']).then(success => {
      console.log('4. Navigation to /home successful:', success);
      console.log('5. New router URL:', this.router.url);
    }).catch(error => {
      console.log('6. Navigation error:', error);
    });
  }
  
  logClick(event: Event, element: string) {
    console.log(`Clicked on ${element}:`, event.target);
    console.log('Event type:', event.type);
    console.log('Event bubbles:', event.bubbles);
  }
}