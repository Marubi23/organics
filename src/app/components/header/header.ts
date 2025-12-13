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
  
  // Authentication properties
  currentUser: User | null = null;
  
  @ViewChild('searchInput') searchInput!: ElementRef;

  private cartSubscription: any;
  private authSubscription: any;

  // Mock product data
  private allProducts: SearchResult[] = [
    {
      id: 1,
      name: 'Liquid NPK Plus',
      description: 'Premium organic liquid fertilizer',
      price: 700,
      category: 'Organic Biofertilizers',
      image: '/images/fertilizer.jpg',
      route: '/products'
    },
    {
      id: 2,
      name: 'Liquid Urea Plus',
      description: 'Organic urea fertilizer solution',
      price: 700,
      category: 'Organic Biofertilizers',
      image: '/images/urea.jpg',
      route: '/products'
    },
    {
      id: 3,
      name: 'Solid NPK ActivePlus',
      description: 'Solid organic NPK fertilizer',
      price: 750,
      category: 'Organic Biofertilizers',
      image: '/images/solid-npk.jpg',
      route: '/products'
    },
    {
      id: 4,
      name: 'Nursery Growing Media',
      description: 'Premium growing medium for nurseries',
      price: 90,
      category: 'Agricultural Inputs',
      image: '/images/growing-media.jpg',
      route: '/products'
    },
    {
      id: 5,
      name: 'Hybrid Fertilizers',
      description: 'Special hybrid fertilizer blend',
      price: 80,
      category: 'Organic Biofertilizers',
      image: '/images/hybrid.jpg',
      route: '/products'
    },
    {
      id: 6,
      name: 'Wet BSF Larvae',
      description: 'High-protein insect larvae for animal feed',
      price: 120,
      category: 'Insect-Based Protein Feeds',
      image: '/images/bsf-larvae.jpg',
      route: '/products'
    },
    {
      id: 7,
      name: 'Red Wigglers',
      description: 'Composting worms for vermiculture',
      price: 3000,
      category: 'Agricultural Inputs',
      image: '/images/red-wigglers.jpg',
      route: '/products'
    },
    {
      id: 8,
      name: 'Organic Avocados',
      description: 'Fresh avocados from Kenyan highlands',
      price: 120,
      category: 'Fruits',
      image: '/images/avacado.jpg',
      route: '/shop'
    },
    {
      id: 9,
      name: 'Organic Kale',
      description: 'Fresh kale bundle from Kenyan farms',
      price: 180,
      category: 'Vegetables',
      image: '/images/kales.jpg',
      route: '/shop'
    }
  ];

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {
    // TEMPORARILY COMMENT OUT THIS SECTION FOR TESTING
    // this.router.events.subscribe(() => {
    //   this.isMobileMenuOpen = false;
    //   document.body.style.overflow = '';
    // });
    
    // Debug router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('Router NavigationEnd:', event.url);
      }
    });
  }

  ngOnInit() {
    console.log('HeaderComponent initialized');
    
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

  // ============= SEARCH FUNCTIONALITY =============

  openSearch() {
    console.log('Opening search');
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
    ).slice(0, 8);
  }

  searchByTag(tag: string) {
    console.log('Search by tag:', tag);
    this.searchTerm = tag;
    this.performSearch();
    if (this.searchInput) {
      this.searchInput.nativeElement.value = tag;
      this.searchInput.nativeElement.focus();
    }
  }

  navigateToSearchResult(result: SearchResult) {
    console.log('Navigating to search result:', result.route);
    this.closeSearch();
    this.router.navigate([result.route]);
  }

  getResultIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Organic Biofertilizers': 'fas fa-vial',
      'Insect-Based Protein Feeds': 'fas fa-paw',
      'Agricultural Inputs': 'fas fa-seedling',
      'Fruits': 'fas fa-apple-alt',
      'Vegetables': 'fas fa-carrot'
    };
    return icons[category] || 'fas fa-box';
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
    console.log('Document click, target:', target.tagName, target.className);
    
    // Close mobile menu if clicked outside
    if (this.isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-menu')) {
      console.log('Closing mobile menu - clicked outside');
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
    
    // Close cart if clicked outside
    if (this.isCartOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-btn')) {
      console.log('Closing cart - clicked outside');
      this.isCartOpen = false;
      document.body.style.overflow = '';
    }

    // Close search if clicked outside
    if (this.isSearchOpen && !target.closest('.search-container') && !target.closest('.search-btn')) {
      console.log('Closing search - clicked outside');
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
}