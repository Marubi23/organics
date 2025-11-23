// cart.service.ts
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

  addToCart(product: any) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category: product.category,
        units: product.units
      });
    }
    
    this.cartItems.next([...currentItems]);
    this.saveToLocalStorage();
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItems.value.filter(item => item.id !== productId);
    this.cartItems.next(currentItems);
    this.saveToLocalStorage();
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.saveToLocalStorage();
    }
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mzuri_cart', JSON.stringify(this.cartItems.value));
    }
  }

  loadFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('mzuri_cart');
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    }
  }
}