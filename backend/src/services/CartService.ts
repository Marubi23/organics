import { collections, getTimestamp } from '../config/firebase';
import { Cart, CartItem, Product } from '../models/schemas';
import { ProductRepository } from '../repositories/ProductRepository';

export class CartService {
  // Get user's cart
  static async getCart(userId: string): Promise<Cart> {
    try {
      const cartRef = collections.cart.doc(userId);
      const cartDoc = await cartRef.get();
      
      if (cartDoc.exists) {
        return { id: cartDoc.id, ...cartDoc.data() } as Cart;
      }
      
      // Create new cart if doesn't exist
      return await this.createEmptyCart(userId);
      
    } catch (error) {
      console.error('Error getting cart:', error);
      throw error;
    }
  }
  
  // Add item to cart
  static async addToCart(userId: string, productId: string, quantity: number = 1): Promise<Cart> {
    try {
      // Get product details
      const product = await ProductRepository.getProductById(productId);
      if (!product) throw new Error('Product not found');
      
      // Get current cart
      let cart = await this.getCart(userId);
      
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        
        // Check stock availability
        if (cart.items[existingItemIndex].quantity > product.stock) {
          throw new Error('Insufficient stock available');
        }
        
      } else {
        // Add new item to cart
        if (quantity > product.stock) {
          throw new Error('Insufficient stock available');
        }
        
        const cartItem: CartItem = {
          productId,
          productName: product.name,
          productImage: product.featuredImage,
          price: product.price,
          quantity,
          units: product.units,
          stockAvailable: product.stock,
          isAvailable: product.inStock,
          addedAt: new Date()
        };
        
        cart.items.push(cartItem);
      }
      
      // Update cart totals
      cart = this.calculateCartTotals(cart);
      
      // Save to database
      await collections.cart.doc(userId).set(cart);
      
      return cart;
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
  
  // Remove item from cart
  static async removeFromCart(userId: string, productId: string): Promise<Cart> {
    try {
      const cart = await this.getCart(userId);
      
      // Remove item
      cart.items = cart.items.filter(item => item.productId !== productId);
      
      // Update cart totals
      const updatedCart = this.calculateCartTotals(cart);
      
      // Save to database
      await collections.cart.doc(userId).set(updatedCart);
      
      return updatedCart;
      
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }
  
  // Update item quantity
  static async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity < 1) {
        return await this.removeFromCart(userId, productId);
      }
      
      const cart = await this.getCart(userId);
      const product = await ProductRepository.getProductById(productId);
      
      if (!product) throw new Error('Product not found');
      
      if (quantity > product.stock) {
        throw new Error('Insufficient stock available');
      }
      
      // Find and update item
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity = quantity;
        
        // Update cart totals
        const updatedCart = this.calculateCartTotals(cart);
        
        // Save to database
        await collections.cart.doc(userId).set(updatedCart);
        
        return updatedCart;
      }
      
      throw new Error('Item not found in cart');
      
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }
  
  // Clear cart
  static async clearCart(userId: string): Promise<Cart> {
    try {
      const emptyCart = await this.createEmptyCart(userId);
      await collections.cart.doc(userId).set(emptyCart);
      return emptyCart;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
  
  // Calculate cart totals
  private static calculateCartTotals(cart: Cart): Cart {
    let totalItems = 0;
    let subtotal = 0;
    
    cart.items.forEach(item => {
      totalItems += item.quantity;
      subtotal += item.price * item.quantity;
    });
    
    // Calculate shipping (free over 5000 KES)
    const shippingCost = subtotal >= 5000 ? 0 : 200;
    
    // Calculate tax (16% VAT)
    const tax = subtotal * 0.16;
    
    cart.totalItems = totalItems;
    cart.subtotal = subtotal;
    cart.shippingCost = shippingCost;
    cart.tax = tax;
    cart.total = subtotal + shippingCost + tax;
    cart.updatedAt = new Date();
    
    // Set cart expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    cart.expiresAt = expiresAt;
    
    return cart;
  }
  
  // Create empty cart
  private static async createEmptyCart(userId: string): Promise<Cart> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    return {
      id: userId,
      userId,
      items: [],
      totalItems: 0,
      subtotal: 0,
      shippingCost: 0,
      tax: 0,
      total: 0,
      updatedAt: new Date(),
      expiresAt
    };
  }
}