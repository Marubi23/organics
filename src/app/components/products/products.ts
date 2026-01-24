// products.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  units: string;
  inStock: boolean;
  stock: number;
  features: string[];
  discount?: number;
  isOrganic: boolean;
  isNew: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  // Products Data
  products: Product[] = [
    {
      id: 1,
      name: 'VermiFrass Active',
      description: 'Superior 100% organic fertilizer with active microbes',
      price: 1500,
      originalPrice: 1800,
      image: 'images/product3.jpg',
      category: 'Biofertilizers',
      rating: 4.9,
      units: '25kg bag',
      inStock: true,
      stock: 45,
      features: ['100% Organic', 'Active Macrobes', 'Rich in NPK'],
      discount: 17,
      isOrganic: true,
      isNew: true
    },
    {
      id: 2,
      name: 'BioVeg Plus',
      description: 'Specialized organic fertilizer for vegetables',
      price: 920,
      image: 'images/bio veg.jpeg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '5kg bag',
      inStock: true,
      stock: 32,
      features: ['For Vegetables', 'Balanced NPK', 'Improves Yield'],
      isOrganic: true,
      isNew: false
    }
  ];

  // Cart State
  cartItems: any[] = [];
  cartCount = 0;
  cartTotal = 0;
  isCartOpen = false;
  showAddedMessage = false;
  addedProductName = '';

  // Filtering
  searchQuery = '';
  selectedCategory = 'all';
  categories = [
    { value: 'all', label: 'All Products', icon: 'fas fa-store' },
    { value: 'Biofertilizers', label: 'Biofertilizers', icon: 'fas fa-seedling' },
    { value: 'Poultry Feeds', label: 'Poultry Feeds', icon: 'fas fa-egg' },
    { value: 'Pig Feeds', label: 'Pig Feeds', icon: 'fas fa-piggy-bank' },
    { value: 'Pet Foods', label: 'Pet Foods', icon: 'fas fa-paw' }
  ];

  // Display
  filteredProducts: Product[] = [];
  viewMode: 'grid' | 'list' = 'grid';

  // For template
  Math = Math;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.filteredProducts = [...this.products];
    this.loadCart();
  }

  // ========== CART METHODS ==========
  loadCart() {
    this.cartItems = this.cartService.getCartItems();
    this.cartCount = this.cartService.getTotalItems();
    this.cartTotal = this.cartService.getTotalPrice();
  }

  addToCart(product: Product) {
    if (!product.inStock) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      units: product.units,
      quantity: 1
    };

    this.cartService.addToCart(cartItem);
    this.showAddSuccess(product.name);
    this.loadCart();
    this.animateAddToCart(product.id);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.loadCart();
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
    this.isCartOpen = false;
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
    if (this.isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // ========== UI ANIMATIONS ==========
  showAddSuccess(productName: string) {
    this.addedProductName = productName;
    this.showAddedMessage = true;
    
    setTimeout(() => {
      this.showAddedMessage = false;
    }, 3000);
  }

  animateAddToCart(productId: number) {
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
      }, 600);
    }
  }

  // ========== FILTER METHODS ==========
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
  }

  // ========== CHECKOUT ==========
  proceedToCheckout() {
    if (this.cartCount === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    this.isCartOpen = false;
    // Navigate to checkout page
    // this.router.navigate(['/checkout']);
  }

  // ========== UTILITIES ==========
  getStockText(product: Product): string {
    if (!product.inStock) return 'Out of Stock';
    if (product.stock < 10) return `Low Stock (${product.stock} left)`;
    return 'In Stock';
  }

  getStockClass(product: Product): string {
    if (!product.inStock) return 'stock-out';
    if (product.stock < 10) return 'stock-low';
    return 'stock-high';
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    if (this.isCartOpen) {
      this.toggleCart();
    }
  }
}