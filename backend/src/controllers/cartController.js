const { collections, increment } = require('../../config/firebase');

class CartController {
  // Get user's cart
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      
      const cartRef = collections.cart.doc(userId);
      const cartDoc = await cartRef.get();
      
      if (!cartDoc.exists) {
        // Create empty cart if doesn't exist
        const emptyCart = {
          userId,
          items: [],
          totalItems: 0,
          subtotal: 0,
          shippingCost: 0,
          tax: 0,
          total: 0,
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        };
        
        await cartRef.set(emptyCart);
        
        return res.json({
          success: true,
          data: { cart: emptyCart }
        });
      }
      
      const cart = cartDoc.data();
      
      // Check if any items are out of stock
      const updatedItems = await Promise.all(
        cart.items.map(async (item) => {
          const productDoc = await collections.products.doc(item.productId).get();
          if (productDoc.exists) {
            const product = productDoc.data();
            return {
              ...item,
              stockAvailable: product.stock,
              isAvailable: product.inStock && product.stock >= item.quantity
            };
          }
          return { ...item, stockAvailable: 0, isAvailable: false };
        })
      );
      
      // Filter out unavailable items
      const availableItems = updatedItems.filter(item => item.isAvailable);
      const unavailableItems = updatedItems.filter(item => !item.isAvailable);
      
      // Update cart if items were removed
      if (unavailableItems.length > 0) {
        const updatedCart = this.calculateCartTotals(availableItems);
        await cartRef.set(updatedCart);
        
        res.json({
          success: true,
          data: {
            cart: updatedCart,
            unavailableItems
          }
        });
      } else {
        res.json({
          success: true,
          data: { cart }
        });
      }
      
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get cart'
      });
    }
  }
  
  // Add item to cart
  static async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
      }
      
      // Get product
      const productDoc = await collections.products.doc(productId).get();
      
      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      const product = productDoc.data();
      
      // Check stock
      if (!product.inStock || product.stock < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Product is out of stock or insufficient quantity available'
        });
      }
      
      // Get current cart
      const cartRef = collections.cart.doc(userId);
      const cartDoc = await cartRef.get();
      
      let cart;
      if (!cartDoc.exists) {
        // Create new cart
        cart = {
          userId,
          items: [],
          totalItems: 0,
          subtotal: 0,
          shippingCost: 0,
          tax: 0,
          total: 0,
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
      } else {
        cart = cartDoc.data();
      }
      
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            error: 'Insufficient stock available'
          });
        }
        
        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].total = product.price * newQuantity;
        
      } else {
        // Add new item
        cart.items.push({
          productId,
          productName: product.name,
          productImage: product.featuredImage || product.images?.[0] || '',
          price: product.price,
          quantity,
          units: product.units,
          total: product.price * quantity,
          addedAt: new Date()
        });
      }
      
      // Update cart totals
      const updatedCart = this.calculateCartTotals(cart.items);
      updatedCart.userId = userId;
      updatedCart.updatedAt = new Date();
      updatedCart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Save to database
      await cartRef.set(updatedCart);
      
      res.json({
        success: true,
        message: 'Item added to cart',
        data: { cart: updatedCart }
      });
      
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add item to cart'
      });
    }
  }
  
  // Update item quantity
  static async updateQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { quantity } = req.body;
      
      if (quantity < 1) {
        return this.removeFromCart(req, res);
      }
      
      // Get product
      const productDoc = await collections.products.doc(productId).get();
      
      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      const product = productDoc.data();
      
      // Check stock
      if (!product.inStock || product.stock < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock available'
        });
      }
      
      // Get cart
      const cartRef = collections.cart.doc(userId);
      const cartDoc = await cartRef.get();
      
      if (!cartDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Cart not found'
        });
      }
      
      const cart = cartDoc.data();
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Item not found in cart'
        });
      }
      
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;
      
      // Update cart totals
      const updatedCart = this.calculateCartTotals(cart.items);
      updatedCart.userId = userId;
      updatedCart.updatedAt = new Date();
      updatedCart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Save to database
      await cartRef.set(updatedCart);
      
      res.json({
        success: true,
        message: 'Cart updated',
        data: { cart: updatedCart }
      });
      
    } catch (error) {
      console.error('Update quantity error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update cart'
      });
    }
  }
  
  // Remove item from cart
  static async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      
      // Get cart
      const cartRef = collections.cart.doc(userId);
      const cartDoc = await cartRef.get();
      
      if (!cartDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Cart not found'
        });
      }
      
      const cart = cartDoc.data();
      
      // Remove item
      const filteredItems = cart.items.filter(item => item.productId !== productId);
      
      // Update cart totals
      const updatedCart = this.calculateCartTotals(filteredItems);
      updatedCart.userId = userId;
      updatedCart.updatedAt = new Date();
      updatedCart.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      // Save to database
      await cartRef.set(updatedCart);
      
      res.json({
        success: true,
        message: 'Item removed from cart',
        data: { cart: updatedCart }
      });
      
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove item from cart'
      });
    }
  }
  
  // Clear cart
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
      
      const cartRef = collections.cart.doc(userId);
      
      const emptyCart = {
        userId,
        items: [],
        totalItems: 0,
        subtotal: 0,
        shippingCost: 0,
        tax: 0,
        total: 0,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
      
      await cartRef.set(emptyCart);
      
      res.json({
        success: true,
        message: 'Cart cleared',
        data: { cart: emptyCart }
      });
      
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cart'
      });
    }
  }
  
  // Calculate cart totals
  static calculateCartTotals(items) {
    let totalItems = 0;
    let subtotal = 0;
    
    items.forEach(item => {
      totalItems += item.quantity;
      subtotal += item.total;
    });
    
    // Calculate shipping (free over 5000 KES)
    const shippingCost = subtotal >= 5000 ? 0 : 200;
    
    // Calculate tax (16% VAT)
    const tax = subtotal * 0.16;
    
    return {
      items,
      totalItems,
      subtotal,
      shippingCost,
      tax,
      total: subtotal + shippingCost + tax
    };
  }
}

module.exports = CartController;