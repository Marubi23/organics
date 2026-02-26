// src/app/components/products/products.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';

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
  imports: [CommonModule, FormsModule, RouterModule, CartComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  // Products Data with updated descriptions
  products: Product[] = [
    {
      id: 1,
      name: 'VermiFrass Active (25Kg)',
      description: 'Solid organic biofertilizer that restores soil organic matter, improves soil structure & moisture retention, and activates beneficial soil microbes. Ideal for vegetables, cereals & orchards.',
      price: 1500,
      originalPrice: 1800,
      image: 'images/vermifrassprod.jpeg',
      category: 'Biofertilizers',
      rating: 4.9,
      units: '25KG bag',
      inStock: true,
      stock: 45,
      features: ['Restores soil organic matter', 'Improves soil structure', 'Activates beneficial microbes'],
      discount: 17,
      isOrganic: true,
      isNew: true
    },
    {
      id: 2,
      name: 'BioVeg Plus (1 Litre)',
      description: 'Liquid organic nitrogen booster that drives fast vegetative growth, improves leaf size & greenness, and enhances microbial activity. Ideal for vegetables, cereals & young crops.',
      price: 700,
      image: 'images/product6.jpg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '1 Litre Bottle',
      inStock: true,
      stock: 32,
      features: ['Drives fast vegetative growth', 'Improves leaf size & greenness', 'Enhances microbial activity'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 3,
      name: 'BioVeg Plus (Half Litre)',
      description: 'Liquid organic nitrogen booster that drives fast vegetative growth, improves leaf size & greenness, and enhances microbial activity. Ideal for vegetables, cereals & young crops.',
      price: 400,
      image: 'images/product6.jpg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: 'Half Litre Bottle',
      inStock: true,
      stock: 32,
      features: ['Drives fast vegetative growth', 'Improves leaf size & greenness', 'Enhances microbial activity'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 4,
      name: 'BioFruity Plus (1 Litre)',
      description: 'Balanced liquid nutrition formula that supports flowering & fruit set, improves nutrient uptake & crop quality, and boosts stress tolerance. Ideal for fruiting crops, maize & perennials.',
      price: 700,
      image: 'images/product2.jpg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '1 Litre Bottle',
      inStock: true,
      stock: 32,
      features: ['Supports flowering & fruit set', 'Improves nutrient uptake', 'Boosts stress tolerance'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 5,
      name: 'BioFruity Plus (Half litre)',
      description: 'Balanced liquid nutrition formula that supports flowering & fruit set, improves nutrient uptake & crop quality, and boosts stress tolerance. Ideal for fruiting crops, maize & perennials.',
      price: 400,
      image: 'images/product2.jpg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: 'Half litre',
      inStock: true,
      stock: 32,
      features: ['Supports flowering & fruit set', 'Improves nutrient uptake', 'Boosts stress tolerance'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 6,
      name: 'Organi-Mineral VF DAP 10%',
      description: 'Organo-mineral starter fertilizer that enhances early root development, improves phosphorus efficiency, and reduces nutrient losses. Ideal for planting stage crops.',
      price: 2200,
      image: 'images/dap10.jpeg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '25 KG bag',
      inStock: true,
      stock: 32,
      features: ['Enhances early root development', 'Improves phosphorus efficiency', 'Reduces nutrient losses'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 7,
      name: 'Organi-Mineral VF CAN 10%',
      description: 'Nitrogen & calcium blend that supports steady vegetative growth, strengthens plant cell walls, and improves nitrogen use efficiency. Ideal for cereals, vegetables & fodder.',
      price: 1900,
      image: 'images/can10.jpeg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '25 KG bag',
      inStock: true,
      stock: 32,
      features: ['Supports steady vegetative growth', 'Strengthens plant cell walls', 'Improves nitrogen efficiency'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 8,
      name: 'Organi-Mineral VF NPK 10%',
      description: 'Balanced NPK organo-mineral fertilizer that feeds crops & regenerates soil, improves nutrient availability, and supports all growth stages. Ideal for general crop production.',
      price: 2000,
      image: 'images/npk10.jpeg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '25 KG bag',
      inStock: true,
      stock: 32,
      features: ['Feeds crops & regenerates soil', 'Improves nutrient availability', 'Supports all growth stages'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 9,
      name: 'Organi-Mineral VF Urea 10%',
      description: 'Controlled-release nitrogen fertilizer that reduces nitrogen losses, protects soil biology, and sustains crop growth. Ideal for maize, sugarcane & vegetables.',
      price: 2200,
      image: 'images/urea10.jpeg',
      category: 'Biofertilizers',
      rating: 4.7,
      units: '25 KG bag',
      inStock: true,
      stock: 32,
      features: ['Controlled-release nitrogen', 'Reduces nitrogen losses', 'Protects soil biology'],
      isOrganic: true,
      isNew: false
    }
  ];

  // Cart State
  cartItems: CartItem[] = [];
  cartCount = 0;
  cartTotal = 0;
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

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredProducts = [...this.products];
    
    // Subscribe to cart items from service
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = this.cartService.getTotalItems();
      this.cartTotal = this.cartService.getTotalPrice();
    });
  }

  // ========== CART METHODS ==========
  addToCart(product: Product) {
    if (!product.inStock) return;

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category,
      units: product.units
    };

    this.cartService.addToCart(cartItem);
    this.showAddSuccess(product.name);
    this.animateAddToCart(product.id);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      this.removeFromCart(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }

  // ========== CHECKOUT ==========
  proceedToCheckout(): void {
    // Close cart using service
    this.cartService.closeCart();
    
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
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
    // Close cart using service when escape is pressed
    if (this.cartService.getCartState()) {
      this.cartService.closeCart();
    }
  }
}