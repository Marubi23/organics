// navigation.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent], // ADD CartComponent HERE
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  cartCount = 0;
  isMobileMenuOpen = false;
  isCartOpen = false;
  private cartSubscription: any;

  constructor(private cartService: CartService) {}

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
    if (typeof document !== 'undefined') {
      if (this.isCartOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('Mobile menu toggled, is open:', this.isMobileMenuOpen);
    
    // Prevent body scroll when mobile menu is open
    if (typeof document !== 'undefined') {
      if (this.isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  toggleMobileDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropdownToggle = event.target as HTMLElement;
    const dropdownMenu = dropdownToggle.nextElementSibling as HTMLElement;
    
    if (dropdownMenu && dropdownMenu.classList.contains('mobile-dropdown-menu')) {
      // Close all other dropdowns first
      const allDropdowns = document.querySelectorAll('.mobile-dropdown-menu');
      allDropdowns.forEach(menu => {
        if (menu !== dropdownMenu) {
          menu.classList.remove('active');
          const toggle = menu.previousElementSibling as HTMLElement;
          if (toggle) {
            toggle.classList.remove('active');
          }
        }
      });

      // Toggle current dropdown
      dropdownMenu.classList.toggle('active');
      dropdownToggle.classList.toggle('active');
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  onSearchClick() {
    console.log('Search clicked - implement search functionality');
    // You can implement a search modal or redirect to search page
  }

  onAuthClick() {
    console.log('Auth clicked - implement auth functionality');
    // You can implement login/signup modal
  }
}