// products.component.ts
import {
  Component,
  AfterViewInit,
  OnDestroy,
  signal,
  Inject,
  PLATFORM_ID,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew: boolean;
  isOrganic: boolean;
  rating: number;
  units: string;
  inStock: boolean;
}

interface Stat {
  value: number;
  suffix: string;
  label: string;
  current: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements AfterViewInit, OnDestroy, OnInit {
  // Horizontal stats like CIC insurance
  stats = signal<Stat[]>([
    { value: 125, suffix: '', label: 'Products', current: 0 },
    { value: 46.7, suffix: 'm', label: 'Total Sales', current: 0 },
    { value: 8.1, suffix: '%', label: 'Market Share', current: 0 },
    { value: 24, suffix: 'hr', label: 'Delivery Time', current: 0 }
  ]);

  // Products data
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Fresh Organic Avocados',
      description: 'Creamy, nutrient-rich avocados straight from our farms',
      price: 120,
      originalPrice: 150,
      image: '/images/avacado.jpg',
      category: 'Fruits',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: 'per piece',
      inStock: true
    },
    {
      id: 2,
      name: 'Organic Kale Bundle',
      description: 'Fresh, crisp kale packed with vitamins and minerals',
      price: 180,
      image: '/images/kales.jpg',
      category: 'Vegetables',
      isNew: false,
      isOrganic: true,
      rating: 4.6,
      units: 'per bundle',
      inStock: true
    },
    {
      id: 3,
      name: 'Pure Honey 500g',
      description: 'Raw, unfiltered honey from our bee farms',
      price: 450,
      originalPrice: 520,
      image: '/images/honey.jpg',
      category: 'Pantry',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: 'per jar',
      inStock: true
    },
    {
      id: 4,
      name: 'Organic Tomatoes',
      description: 'Vine-ripened tomatoes with rich flavor',
      price: 90,
      image: '/images/tomatoes.jpg',
      category: 'Vegetables',
      isNew: false,
      isOrganic: true,
      rating: 4.5,
      units: 'per kg',
      inStock: true
    },
    {
      id: 5,
      name: 'Organic Biofertilizer',
      description: 'Nutrient-rich fertilizer from BSFL bioconversion process',
      price: 850,
      image: '/images/ferterlizer.jpg',
      category: 'Agricultural Inputs',
      isNew: true,
      isOrganic: true,
      rating: 4.7,
      units: 'per 5kg bag',
      inStock: true
    },
    {
      id: 6,
      name: 'Insect Protein Feed',
      description: 'High-protein animal feed from Black Soldier Fly Larvae',
      price: 1200,
      originalPrice: 1400,
      image: '/images/insectifood.jpg',
      category: 'Animal Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: 'per 10kg bag',
      inStock: true
    }
  ]);

  cartItemCount = signal(0); // Add cart count signal
  private statsAnimated = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private cartService: CartService // Inject cart service
  ) {}

  ngOnInit() {
    // Load cart from localStorage and subscribe to cart updates
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.loadFromLocalStorage();
      this.cartService.cartItems$.subscribe(items => {
        this.cartItemCount.set(this.cartService.getTotalItems());
      });
    }
  }

  ngAfterViewInit(): void {
    // Only initialize animation in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.initStatsAnimation();
    } else {
      // On server, set the final values immediately
      const finalStats = this.stats().map(stat => ({
        ...stat,
        current: stat.value
      }));
      this.stats.set(finalStats);
    }
  }

  ngOnDestroy(): void {}

  // Animated counting for stats - horizontal like CIC
  private initStatsAnimation(): void {
    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback: animate immediately
      this.animateStats();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.statsAnimated) {
          this.statsAnimated = true;
          this.animateStats();
        }
      });
    });

    const statsElement = document.getElementById('products-stats');
    if (statsElement) {
      observer.observe(statsElement);
    }
  }

  private animateStats(): void {
    const duration = 2000;
    const steps = 60;
    
    this.stats().forEach((stat, index) => {
      let step = 0;
      const increment = stat.value / steps;
      
      const timer = setInterval(() => {
        step++;
        const newStats = [...this.stats()];
        newStats[index].current = Math.min(stat.value, increment * step);
        this.stats.set(newStats);
        
        if (step === steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    });
  }

  // UPDATED: Add to cart with cart service integration
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.showAddToCartNotification(product.name);
  }

  private showAddToCartNotification(productName: string): void {
    // Create a temporary notification
    if (isPlatformBrowser(this.platformId)) {
      const notification = document.createElement('div');
      notification.textContent = `✓ Added ${productName} to cart!`;
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #8bc34a;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
      `;
      
      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          notification.remove();
          style.remove();
        }, 300);
      }, 2000);
    }
  }

  quickView(product: Product): void {
    console.log('Quick view:', product.name);
    // Implement quick view modal logic here
    // For now, we'll show product details in an alert
    alert(`Quick View: ${product.name}\n\nPrice: KSh ${product.price}\nCategory: ${product.category}\nRating: ${product.rating}/5\n\n${product.description}`);
  }

  getRatingStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    // Fill remaining stars
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }

  // Helper to format numbers for display
  formatStatValue(stat: Stat): string {
    if (stat.value % 1 === 0) {
      return stat.current.toFixed(0) + stat.suffix;
    }
    return stat.current.toFixed(1) + stat.suffix;
  }

  // Optional: Method to get product by ID
  getProductById(id: number): Product | undefined {
    return this.products().find(product => product.id === id);
  }

  // Optional: Method to filter products by category
  getProductsByCategory(category: string): Product[] {
    return this.products().filter(product => product.category === category);
  }

  // Optional: Method to get featured products
  getFeaturedProducts(): Product[] {
    return this.products().filter(product => product.isNew || product.rating >= 4.7);
  }

  // NEW: Method to get cart items count for display
  getCartItemsCount(): number {
    return this.cartItemCount();
  }
}