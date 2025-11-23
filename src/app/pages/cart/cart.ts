// cart.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  @Input() isOpen = false;
  @Output() closeCart = new EventEmitter<void>();
  
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(private cartService: CartService) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  onCloseCart() {
    this.closeCart.emit();
  }

  increaseQuantity(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      this.cartService.updateQuantity(id, item.quantity + 1);
    }
  }

  decreaseQuantity(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(id, item.quantity - 1);
    } else {
      this.cartService.removeFromCart(id);
    }
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  proceedToCheckout() {
    // Navigate to checkout page
    console.log('Proceeding to checkout');
    this.onCloseCart();
  }

  // Prevent closing when clicking inside the cart
  onCartClick(event: Event) {
    event.stopPropagation();
  }

  // Add this method to handle broken images
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/images/placeholder-product.jpg'; // Fallback image
    imgElement.alt = 'Product image not available';
  }
}