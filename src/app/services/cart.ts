import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  units: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  
  // ADD: Cart visibility state (for sidebar)
  private isCartOpen = new BehaviorSubject<boolean>(false);
  isCartOpen$ = this.isCartOpen.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  // ========== SIDEBAR CART METHODS ==========
  openCart(): void {
    this.isCartOpen.next(true);
    document.body.style.overflow = 'hidden';
  }

  closeCart(): void {
    this.isCartOpen.next(false);
    document.body.style.overflow = '';
  }

  toggleCart(): void {
    const currentState = this.isCartOpen.value;
    this.isCartOpen.next(!currentState);
    
    if (!currentState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  getCartState(): boolean {
    return this.isCartOpen.value;
  }

  // ========== CART ITEMS METHODS ==========
  loadFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems.next(JSON.parse(savedCart));
      } catch {
        this.cartItems.next([]);
      }
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  getTotalItems(): number {
    const items = this.cartItems.value;
    return items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }
    
    this.cartItems.next([...currentItems]);
    this.saveToLocalStorage();
  }

  removeFromCart(id: number): void {
    const currentItems = this.cartItems.value.filter(item => item.id !== id);
    this.cartItems.next(currentItems);
    this.saveToLocalStorage();
  }

  updateQuantity(id: number, quantity: number): void {
    const currentItems = this.cartItems.value.map(item => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    });
    
    this.cartItems.next(currentItems);
    this.saveToLocalStorage();
  }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  getTotalPrice(): number {
    const items = this.cartItems.value;
    return items.reduce((total: number, item: CartItem) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }
}