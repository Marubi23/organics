// src/app/components/hamburger-menu/hamburger-menu.component.ts
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService, User } from '../../services/auth.service';

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
  currentYear = new Date().getFullYear();
  isProductsOpen = false;
  isAboutOpen = false;
  private subscriptions: any[] = [];

  menuItems = [
    { text: 'Home', route: '/home' },
    { text: 'Blog', route: '/blog' },
    { text: 'Testimonials', route: '/testimonials' },
    { text: 'FAQ', route: '/faq' },
    { text: 'Contact', route: '/contact' }
  ];

  productChildren = [
    { text: 'Biofertilizers', route: '/products' },
    { text: 'Animal Feeds', route: '/products' },
    { text: 'Shop All', route: '/products' }
  ];

  aboutChildren = [
    { text: 'Overview', route: '/about' },
    { text: 'What We Do', route: '/what-we-do' },
    { text: 'Challenges', route: '/challenges' },
    { text: 'Impacts', route: '/impacts' }
  ];

  accountItems = [
    { text: 'My Profile', route: '/account' },
    { text: 'My Orders', route: '/orders' },
    { text: 'Wishlist', route: '/wishlist' },
    { text: 'Settings', route: '/settings' }
  ];

  constructor(
    private router: Router,
    public cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe((items: any[]) => {
        this.cartCount = items.reduce((total: number, item: any) => total + item.quantity, 0);
      })
    );
    
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
    // Close dropdowns when closing
    this.isProductsOpen = false;
    this.isAboutOpen = false;
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.onClose();
  }

  toggleProducts() {
    this.isProductsOpen = !this.isProductsOpen;
    // Close other dropdown
    if (this.isProductsOpen) {
      this.isAboutOpen = false;
    }
  }

  toggleAbout() {
    this.isAboutOpen = !this.isAboutOpen;
    // Close other dropdown
    if (this.isAboutOpen) {
      this.isProductsOpen = false;
    }
  }

  toggleCart() {
    this.cartService.toggleCart();
    this.onClose();
  }

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

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}