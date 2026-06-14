// src/app/components/hamburger-menu/hamburger-menu.component.ts
import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService, User } from '../../services/auth.service';

interface MenuItem {
  text: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
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
  currentYear = new Date().getFullYear();
  private subscriptions: any[] = [];

  // Menu items with dropdowns
  menuItems: MenuItem[] = [
    { text: 'Home', icon: 'fas fa-home', route: '/home' },
    { 
      text: 'Products', 
      icon: 'fas fa-seedling', 
      children: [
        { text: 'Biofertilizers', icon: 'fas fa-leaf', route: '/products' },
        { text: 'Animal Feeds', icon: 'fas fa-paw', route: '/products' },
        { text: 'Shop All', icon: 'fas fa-shopping-bag', route: '/products' }
      ]
    },
    { 
      text: 'About Us', 
      icon: 'fas fa-info-circle',
      children: [
        { text: 'Overview', icon: 'fas fa-eye', route: '/about' },
        { text: 'What We Do', icon: 'fas fa-hands-helping', route: '/what-we-do' },
        { text: 'Challenges', icon: 'fas fa-exclamation-triangle', route: '/challenges' },
        { text: 'Impacts', icon: 'fas fa-chart-line', route: '/impacts' }
      ]
    },
    { text: 'Blog', icon: 'fas fa-newspaper', route: '/blog' },
    { text: 'Testimonials', icon: 'fas fa-star', route: '/testimonials' },
    { text: 'FAQ', icon: 'fas fa-question-circle', route: '/faq' },
    { text: 'Contact', icon: 'fas fa-envelope', route: '/contact' }
  ];

  // Account items for logged in users
  accountItems = [
    { text: 'My Profile', icon: 'fas fa-user', route: '/account' },
    { text: 'My Orders', icon: 'fas fa-shopping-bag', route: '/orders' },
    { text: 'Wishlist', icon: 'fas fa-heart', route: '/wishlist' },
    { text: 'Settings', icon: 'fas fa-cog', route: '/settings' }
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
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.onClose();
  }

  toggleSubmenu(item: MenuItem) {
    if (item.children) {
      item.isOpen = !item.isOpen;
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

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}