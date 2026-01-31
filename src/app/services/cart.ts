// src/app/services/cart.service.ts
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

  constructor() {
    this.loadFromLocalStorage();
  }

  // FIXED: This method exists now
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

  // FIXED: This method exists now
  getCartItems(): CartItem[] {
    return this.cartItems.getValue();
  }

  // FIXED: This method exists now
  getTotalItems(): number {
    const items = this.cartItems.getValue();
    return items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.getValue();
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
    const currentItems = this.cartItems.getValue().filter(item => item.id !== id);
    this.cartItems.next(currentItems);
    this.saveToLocalStorage();
  }

  updateQuantity(id: number, quantity: number): void {
    const currentItems = this.cartItems.getValue().map(item => {
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
    const items = this.cartItems.getValue();
    return items.reduce((total: number, item: CartItem) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.getValue()));
  }
}