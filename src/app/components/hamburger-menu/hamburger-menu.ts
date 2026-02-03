// src/app/components/hamburger-menu/hamburger-menu.component.ts
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService, User } from '../../services/auth.service';

interface HamburgerMenuItem {
  text: string;
  icon: string;
  route: string;
  children?: HamburgerMenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hamburger-menu.html',
  styleUrls: ['./hamburger-menu.css']
})
export class HamburgerMenuComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  
  currentUser: User | null = null;
  cartCount = 0;
  cartTotal = 0;
  private subscriptions: any[] = [];

  // Mobile menu items matching your routes
  menuItems: HamburgerMenuItem[] = [
    { text: 'Home', icon: 'fas fa-home', route: '/home' },
    { text: 'Shop', icon: 'fas fa-shopping-bag', route: '/shop' },
    { 
      text: 'Products', 
      icon: 'fas fa-box-open', 
      route: '/products',
      children: [
        { text: 'Biofertilizers', icon: 'fas fa-vial', route: '/products' },
        { text: 'Animal Feeds', icon: 'fas fa-paw', route: '/products' },
        { text: 'All Products', icon: 'fas fa-boxes', route: '/products' }
      ]
    },
    { 
      text: 'About', 
      icon: 'fas fa-info-circle', 
      route: '/about',
      children: [
        { text: 'Overview', icon: 'fas fa-eye', route: '/about' },
        { text: 'What We Do', icon: 'fas fa-hands-helping', route: '/what-we-do' },
        { text: 'Challenges', icon: 'fas fa-exclamation-triangle', route: '/challenges' },
        { text: 'Impacts', icon: 'fas fa-chart-line', route: '/impacts' }
      ]
    },
    { text: 'Testimonials', icon: 'fas fa-comment', route: '/testimonials' },
    { text: 'Blog', icon: 'fas fa-blog', route: '/blog' },
    { text: 'FAQ', icon: 'fas fa-question-circle', route: '/faq' },
    { text: 'Contact', icon: 'fas fa-envelope', route: '/contact' },
    { text: 'Sign Up', icon: 'fas fa-user-plus', route: '/signup' },
    { text: 'Login', icon: 'fas fa-sign-in-alt', route: '/login' }
  ];

  // Account menu items
  accountMenuItems = [
    { text: 'My Profile', icon: 'fas fa-user-circle', route: '/login' },
    { text: 'Orders', icon: 'fas fa-shopping-bag', route: '/login' },
    { text: 'Wishlist', icon: 'fas fa-heart', route: '/login' },
    { text: 'Settings', icon: 'fas fa-cog', route: '/settings' },
    { text: 'Help Center', icon: 'fas fa-question-circle', route: '/contact' }
  ];

  constructor(
    private router: Router,
    public cartService: CartService, // Changed to public for template access
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to cart items count
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe((items: any[]) => {
        this.cartCount = items.reduce((total: number, item: any) => total + item.quantity, 0);
        this.cartTotal = this.cartService.getTotalPrice();
      })
    );
    
    // Subscribe to user auth state
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user: User | null) => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onClose() {
    this.closeMenu.emit();
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.onClose();
  }

  toggleSubmenu(item: HamburgerMenuItem) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    } else {
      this.navigate(item.route);
    }
  }

  // ============ CART FUNCTIONALITY ============
  toggleCart() {
    // Same implementation as header component
    this.cartService.toggleCart();
    this.onClose(); // Close the hamburger menu
  }

  get isCartOpen(): boolean {
    return this.cartService.getCartState();
  }

  // ============ CART DATA METHODS ============
  getCartItems() {
    return this.cartService.getCartItems();
  }

  getCartTotal() {
    return this.cartService.getTotalPrice();
  }

  // ============ ACCOUNT FUNCTIONALITY ============
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
    this.onClose();
  }

  // ============ NAVIGATION HELPERS ============
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}