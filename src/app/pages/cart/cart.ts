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
  // REMOVE: @Input() and @Output() - we'll use service directly
  cartItems: CartItem[] = [];
  totalPrice = 0;
  isOpen = false;

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

  // Use service methods instead of events
  onCloseCart(): void {
    this.cartService.closeCart();
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