// src/app/pages/cart/cart.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, CartItem} from'../../services/cart';
import { from } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeCart = new EventEmitter<void>();
  
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart items observable
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((total: number, item: CartItem) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  onCloseCart(): void {
    this.closeCart.emit();
  }

  increaseQuantity(id: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      this.cartService.updateQuantity(id, item.quantity + 1);
    }
  }

  decreaseQuantity(id: number): void {
    const item = this.cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(id, item.quantity - 1);
    } else {
      this.cartService.removeFromCart(id);
    }
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
    this.onCloseCart();
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