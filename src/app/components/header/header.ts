// header.component.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent], // ADD CartComponent HERE
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isMobileMenuOpen = false;
  isCartOpen = false; // ADD THIS PROPERTY
  private cartSubscription: any;

  constructor(
    private router: Router,
    private cartService: CartService // ADD CartService
  ) {
    // Close mobile menu when route changes
    this.router.events.subscribe(() => {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    });
  }

  ngOnInit() {
    // Subscribe to cart updates
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = this.cartService.getTotalItems();
    });

    // Load cart from localStorage
    this.cartService.loadFromLocalStorage();
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    console.log('Cart toggled, is open:', this.isCartOpen);
    
    // Prevent body scroll when cart is open
    document.body.style.overflow = this.isCartOpen ? 'hidden' : '';
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when menu is open
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

  // Close mobile menu when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
    // Close mobile menu when clicking outside
    if (this.isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-menu')) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
    
    // Close cart when clicking outside
    if (this.isCartOpen && !target.closest('.cart-sidebar') && !target.closest('.cart-btn')) {
      this.isCartOpen = false;
      document.body.style.overflow = '';
    }
  }

  // Close mobile menu on escape key
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
  }

  // Close mobile menu on window resize (if resizing to desktop)
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const window = event.target as Window;
    if (window.innerWidth > 968 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}