// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  units: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item });
    }
    
    this.saveToLocalStorage();
    this.cartItemsSubject.next([...this.cartItems]);
  }

  removeFromCart(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    this.saveToLocalStorage();
    this.cartItemsSubject.next([...this.cartItems]);
  }

  updateQuantity(id: number, quantity: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      this.saveToLocalStorage();
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }

  clearCart() {
    this.cartItems = [];
    this.saveToLocalStorage();
    this.cartItemsSubject.next([]);
  }

  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

 public loadFromLocalStorage() {
    const savedCart = localStorage.getItem('mzuri_cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartItemsSubject.next([...this.cartItems]);
      } catch (e) {
        this.cartItems = [];
      }
    }
  }


  private saveToLocalStorage() {
    localStorage.setItem('mzuri_cart', JSON.stringify(this.cartItems));
  }
}