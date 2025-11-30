// header.component.ts
import { Component, HostListener, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';

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
  
  @ViewChild('searchInput') searchInput!: ElementRef;

  private cartSubscription: any;

  // Mock product data - in real app, this would come from a service
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
    private cartService: CartService
  ) {
    this.router.events.subscribe(() => {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    });
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = this.cartService.getTotalItems();
    });
    this.cartService.loadFromLocalStorage();
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // Search functionality
  openSearch() {
    this.isSearchOpen = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 100);
  }

  closeSearch() {
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
    ).slice(0, 8); // Limit results
  }

  searchByTag(tag: string) {
    this.searchTerm = tag;
    this.performSearch();
    if (this.searchInput) {
      this.searchInput.nativeElement.value = tag;
      this.searchInput.nativeElement.focus();
    }
  }

  navigateToSearchResult(result: SearchResult) {
    this.closeSearch();
    this.router.navigate([result.route]);
    // Scroll to product or filter could be implemented here
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

  // Existing methods
  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    document.body.style.overflow = this.isCartOpen ? 'hidden' : '';
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  toggleMobileDropdown(event: Event) {
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
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    if (this.isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-menu')) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
    
    if (this.isCartOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-btn')) {
      this.isCartOpen = false;
      document.body.style.overflow = '';
    }

    if (this.isSearchOpen && !target.closest('.search-container') && !target.closest('.search-btn')) {
      this.closeSearch();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
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
    if (window.innerWidth > 968 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}