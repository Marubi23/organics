import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isOpen = false;
  
  // Toast notifications
  showToast = false;
  toastTitle = '';
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' | 'warning' = 'success';
  toastIcon = '';
  private toastTimeout: any;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart items
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });

    // Subscribe to cart visibility state
    this.cartService.isCartOpen$.subscribe(state => {
      this.isOpen = state;
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total: number, item: CartItem) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Toast notification system
  private showNotification(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toastTitle = title;
    this.toastMessage = message;
    this.toastType = type;
    
    // Set appropriate icon
    switch(type) {
      case 'success':
        this.toastIcon = 'fas fa-check-circle';
        break;
      case 'error':
        this.toastIcon = 'fas fa-exclamation-circle';
        break;
      case 'info':
        this.toastIcon = 'fas fa-info-circle';
        break;
      case 'warning':
        this.toastIcon = 'fas fa-exclamation-triangle';
        break;
    }
    
    // Show toast
    this.showToast = true;
    
    // Auto-hide after 3 seconds
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, 3000);
  }

  hideToast(): void {
    this.showToast = false;
  }

  // Cart methods with toast notifications
  onCloseCart(): void {
    this.cartService.closeCart();
  }

  increaseQuantity(id: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      this.cartService.updateQuantity(id, item.quantity + 1);
      this.showNotification(
        'Quantity Updated',
        `${item.name} quantity increased to ${item.quantity + 1}`,
        'success'
      );
    }
  }

  decreaseQuantity(id: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(id, item.quantity - 1);
      this.showNotification(
        'Quantity Updated',
        `${item.name} quantity decreased to ${item.quantity - 1}`,
        'info'
      );
    } else {
      this.removeItem(id);
    }
  }

  removeItem(id: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      this.cartService.removeFromCart(id);
      this.showNotification(
        'Item Removed',
        `${item.name} has been removed from your cart`,
        'warning'
      );
    }
  }

  clearCart(): void {
    if (this.cartItems.length > 0) {
      this.cartService.clearCart();
      this.showNotification(
        'Cart Cleared',
        'All items have been removed from your cart',
        'info'
      );
    }
  }

  proceedToCheckout(): void {
    this.cartService.closeCart();
    this.router.navigate(['/checkout']);
  }

  onCartClick(event: Event): void {
    event.stopPropagation();
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/images/placeholder-product.jpg';
    imgElement.alt = 'Product image not available';
  }
}