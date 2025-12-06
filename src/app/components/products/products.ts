// products.component.ts - COMPLETE FIXED VERSION
import {
  Component,
  AfterViewInit,
  OnDestroy,
  signal,
  Inject,
  PLATFORM_ID,
  OnInit,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';
import { trigger, transition, style, animate } from '@angular/animations';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subCategory?: string;
  isNew: boolean;
  isOrganic: boolean;
  rating: number;
  units: string;
  inStock: boolean;
  features?: string[];
  stockStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  discount?: number;
  weight?: string;
  origin?: string;
  application?: string;
  composition?: string;
  stock?: number;
}

interface Category {
  value: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

interface HeroStat {
  value: number;
  label: string;
  icon: string;
}

interface JourneyStep {
  title: string;
  description: string;
  icon: string;
  location: string;
  duration: string;
}

interface SpecialOffer {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CartComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements AfterViewInit, OnDestroy, OnInit {
  // Hero Stats
  heroStats: HeroStat[] = [
    { value: 125, label: 'Organic Products', icon: 'fas fa-leaf' },
    { value: 8100, label: 'Farmers Served', icon: 'fas fa-users' },
    { value: 46700000, label: 'Total Sales (KSh)', icon: 'fas fa-chart-line' },
    { value: 24, label: 'Delivery Hours', icon: 'fas fa-truck' }
  ];

  // Journey Steps
  journeySteps: JourneyStep[] = [
    {
      title: 'Kenyan Waste Collection',
      description: 'Gathering plant residue & animal waste from sustainable Kenyan farms',
      icon: 'fas fa-recycle',
      location: 'Nationwide',
      duration: 'Continuous'
    },
    {
      title: 'BSFL Bioconversion',
      description: 'Black Soldier Fly Larvae transform organic waste into nutrient-rich biomass',
      icon: 'fas fa-bug',
      location: 'Mzuri Processing Facility',
      duration: '7-14 days'
    },
    {
      title: 'Vermicomposting',
      description: 'Red Wigglers enhance compost quality and accelerate decomposition',
      icon: 'fas fa-worm',
      location: 'Mzuri Processing Facility',
      duration: '30-60 days'
    },
    {
      title: 'Quality Production',
      description: 'Premium organic products packaged for Kenyan farmers',
      icon: 'fas fa-box',
      location: 'Kenya',
      duration: 'Fresh Daily'
    }
  ];

  // Special Offers
  specialOffers: SpecialOffer[] = [
    {
      icon: 'fas fa-truck',
      title: 'Free Delivery',
      description: 'Orders over KSh 5,000'
    },
    {
      icon: 'fas fa-percentage',
      title: 'Bulk Discount',
      description: 'Save up to 20% on large orders'
    },
    {
      icon: 'fas fa-gift',
      title: 'Farmers Club',
      description: 'Exclusive benefits for members'
    }
  ];

  // Categories
  categories: Category[] = [
    { 
      value: 'all', 
      label: 'All Products', 
      icon: 'fas fa-store', 
      description: 'Browse all products',
      color: '#1a3c07'
    },
    { 
      value: 'Biofertilizers', 
      label: 'Biofertilizers', 
      icon: 'fas fa-seedling', 
      description: 'Organic fertilizers with active microbes',
      color: '#8bc34a'
    },
    { 
      value: 'Blended Fertilizers', 
      label: 'Blended Fertilizers', 
      icon: 'fas fa-flask', 
      description: 'Organo-mineral blends',
      color: '#ff9800'
    },
    { 
      value: 'Poultry Feeds', 
      label: 'Poultry Feeds', 
      icon: 'fas fa-egg', 
      description: 'Insect-based protein feeds',
      color: '#ff5722'
    },
    { 
      value: 'Pig Feeds', 
      label: 'Pig Feeds', 
      icon: 'fas fa-piggy-bank', 
      description: 'High-protein pig feeds',
      color: '#795548'
    },
    { 
      value: 'Pet Foods', 
      label: 'Pet Foods', 
      icon: 'fas fa-paw', 
      description: 'Nutritious pet treats',
      color: '#607d8b'
    }
  ];

  // Sort Options
  sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A-Z' }
  ];

  // REAL Mzuri Products Data
  private allProducts: Product[] = [
    // Biofertilizers
    {
      id: 1,
      name: 'VermiFrass Active',
      description: 'Superior 100% organic fertilizer with active macrobes and microbes, rich in NPK, Magnesium, Calcium, Sulphur, Iron, and Manganese. Contains living microbes that enhance plant nutrition.',
      price: 850,
      originalPrice: 1000,
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: '5kg bag',
      inStock: true,
      stock: 45,
      features: [
        '100% Organic',
        'Active Macrobes & Microbes',
        'Rich in NPK + Micro Nutrients',
        'Enhances Soil Structure',
        'For All Crop Types'
      ],
      discount: 15,
      weight: '5kg',
      origin: 'Mzuri Organics Kenya',
      application: 'Apply 200-400g per square meter',
      composition: 'Organic matter, NPK, Ca, Mg, S, Fe, Mn, living microbes'
    },
    {
      id: 2,
      name: 'BioVeg Plus',
      description: 'Specialized organic fertilizer for vegetables, optimized for leafy growth and high yields. Contains balanced nutrients for healthy vegetable production.',
      price: 920,
      image: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400&h=300&fit=crop',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: false,
      isOrganic: true,
      rating: 4.7,
      units: '5kg bag',
      inStock: true,
      stock: 32,
      features: [
        'For Vegetables',
        'Balanced NPK Ratio',
        'Promotes Leafy Growth',
        'Improves Yield',
        'Disease Resistance'
      ],
      weight: '5kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 3,
      name: 'BioFruity Plus',
      description: 'Premium organic fertilizer for fruit trees and vines. Enhances fruit quality, size, and sweetness while improving soil health.',
      price: 1050,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1576629854818-eb5c9c6d5a8f?w=400&h=300&fit=crop',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '5kg bag',
      inStock: true,
      stock: 28,
      features: [
        'For Fruit Trees',
        'Enhances Fruit Quality',
        'Increases Sweetness',
        'Improves Shelf Life',
        'Boosts Flowering'
      ],
      discount: 12,
      weight: '5kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 4,
      name: 'Liquid Frass',
      description: 'Concentrated liquid fertilizer from BSFL frass. Easy to apply through irrigation systems for quick nutrient absorption.',
      price: 1800,
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w-400&h=300&fit=crop',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: false,
      isOrganic: true,
      rating: 4.6,
      units: '1L bottle',
      inStock: true,
      stock: 15,
      features: [
        'Liquid Concentrate',
        'Fast Absorption',
        'Suitable for Drip Irrigation',
        'Balanced Nutrients',
        'Easy to Use'
      ],
      weight: '1L',
      origin: 'Mzuri Organics Kenya'
    },

    // Blended Fertilizers
    {
      id: 5,
      name: 'NPK Active',
      description: 'Precision-engineered organo-mineral fertilizer that blends living organic biology with targeted mineral nutrition. Delivers fast, balanced nutrients while rebuilding soil structure.',
      price: 1250,
      originalPrice: 1500,
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129fc?w=400&h=300&fit=crop',
      category: 'Blended Fertilizers',
      subCategory: 'Organo-mineral',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: '5kg bag',
      inStock: true,
      stock: 50,
      features: [
        'Organo-mineral Blend',
        'Fast Nutrient Release',
        'Rebuilds Soil Structure',
        'Boosts Microbial Activity',
        'Higher Yields'
      ],
      discount: 17,
      weight: '5kg',
      origin: 'Mzuri Organics Kenya'
    },

    // Poultry Feeds
    {
      id: 6,
      name: 'i-Chick Mash',
      description: 'High-protein starter feed for chicks containing up to 50% protein from BSFL. Excellent for early growth and development.',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400&h=300&fit=crop',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '25kg bag',
      inStock: true,
      stock: 25,
      features: [
        '50% Protein from BSFL',
        'For Chicks (0-8 weeks)',
        'Promotes Early Growth',
        'Boosts Immunity',
        'Reduces Mortality'
      ],
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 7,
      name: 'i-Growers Mash',
      description: 'Balanced grower feed for developing chickens. Optimized for steady growth and feather development.',
      price: 2900,
      originalPrice: 3200,
      image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400&h=300&fit=crop',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: false,
      isOrganic: true,
      rating: 4.7,
      units: '25kg bag',
      inStock: true,
      stock: 38,
      features: [
        'For Growers (8-18 weeks)',
        'Balanced Protein',
        'Feather Development',
        'Strong Bones',
        'Healthy Weight Gain'
      ],
      discount: 9,
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 8,
      name: 'i-Broilers Mash',
      description: 'High-energy feed for broiler chickens. Maximizes weight gain and meat production efficiency.',
      price: 3100,
      image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400&h=300&fit=crop',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '25kg bag',
      inStock: true,
      stock: 20,
      stockStatus: 'Low Stock',
      features: [
        'For Broilers',
        'Fast Weight Gain',
        'High Energy',
        'Quality Meat',
        'Efficient Feed Conversion'
      ],
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 9,
      name: 'i-Layers Mash',
      description: 'Specialized feed for laying hens. Optimized for egg production, shell quality, and hen health.',
      price: 3000,
      originalPrice: 3400,
      image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400&h=300&fit=crop',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: false,
      isOrganic: true,
      rating: 4.9,
      units: '25kg bag',
      inStock: true,
      stock: 42,
      features: [
        'For Laying Hens',
        'Increases Egg Production',
        'Strong Egg Shells',
        'Rich Yolk Color',
        'Hen Health'
      ],
      discount: 12,
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },

    // Pig Feeds
    {
      id: 10,
      name: 'i-Pig Creep Pellets',
      description: 'High-protein starter feed for piglets. Easy to digest and promotes early weaning success.',
      price: 3800,
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop',
      category: 'Pig Feeds',
      subCategory: 'Pig Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.7,
      units: '25kg bag',
      inStock: true,
      stock: 18,
      features: [
        'For Piglets',
        'High Digestibility',
        'Early Weaning',
        'Strong Immunity',
        'Fast Growth'
      ],
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 11,
      name: 'i-Pig Sow & Weaner',
      description: 'Balanced feed for sows and weaners. Supports reproduction and healthy weaning.',
      price: 3500,
      originalPrice: 3900,
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop',
      category: 'Pig Feeds',
      subCategory: 'Pig Feed',
      isNew: false,
      isOrganic: true,
      rating: 4.6,
      units: '25kg bag',
      inStock: true,
      stock: 30,
      features: [
        'For Sows & Weaners',
        'Reproductive Health',
        'Milk Production',
        'Weaner Growth',
        'Balanced Nutrition'
      ],
      discount: 10,
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },
    {
      id: 12,
      name: 'i-Pig Finisher',
      description: 'High-energy feed for finishing pigs. Maximizes weight gain and meat quality before slaughter.',
      price: 3300,
      image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop',
      category: 'Pig Feeds',
      subCategory: 'Pig Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '25kg bag',
      inStock: true,
      stock: 22,
      features: [
        'For Finishing Pigs',
        'Maximum Weight Gain',
        'Lean Meat',
        'Feed Efficiency',
        'Quality Marbling'
      ],
      weight: '25kg',
      origin: 'Mzuri Organics Kenya'
    },

    // Pet Foods
    {
      id: 13,
      name: 'i-Dig Treats',
      description: 'Nutritious treats for dogs made from BSFL protein. Highly palatable and excellent for training.',
      price: 950,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1562176566-73c303ac1617?w=400&h=300&fit=crop',
      category: 'Pet Foods',
      subCategory: 'Pet Treats',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: '500g pack',
      inStock: true,
      stock: 55,
      features: [
        'For Dogs',
        'High Protein Treats',
        'Great for Training',
        'Healthy Skin & Coat',
        'All Natural'
      ],
      discount: 21,
      weight: '500g',
      origin: 'Mzuri Organics Kenya'
    }
  ];

  // Signal for products
  products = signal<Product[]>([]);
  
  // Filtering
  selectedCategory = 'all';
  selectedSort = 'featured';
  searchQuery = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  
  // View
  viewMode: 'grid' | 'list' = 'grid';
  
  // Quick View
  quickViewProduct: Product | null = null;
  quickViewQuantity = 1;
  
  // Cart
  cartItemCount = signal(0);
  isCartOpen = false;
  
  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  
  // Scroll
  showScrollButton = false;
  imageLoaded = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.products.set([...this.allProducts]);
    this.totalPages = Math.ceil(this.allProducts.length / this.pageSize);
    this.updateDisplayedProducts();
    
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.loadFromLocalStorage();
      this.cartService.cartItems$.subscribe(items => {
        this.cartItemCount.set(this.cartService.getTotalItems());
      });
    }
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  // ========== INITIALIZATION ==========
  private initAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Initialize particles animation
    this.initParticles();
    
    // Initialize scroll animations
    this.initScrollAnimations();
  }

  private initParticles(): void {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      const size = Math.random() * 30 + 10;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      
      (particle as HTMLElement).style.width = `${size}px`;
      (particle as HTMLElement).style.height = `${size}px`;
      (particle as HTMLElement).style.left = `${posX}%`;
      (particle as HTMLElement).style.top = `${posY}%`;
      (particle as HTMLElement).style.animationDuration = `${duration}s`;
    });
  }

  private initScrollAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.journey-step, .product-card').forEach(el => {
      observer.observe(el);
    });
  }

  // ========== PRODUCT FILTERING ==========
  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  onSortChange(event: any): void {
    this.selectedSort = event.target.value;
    this.updateDisplayedProducts();
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  applyPriceFilter(): void {
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

  toggleViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  updateDisplayedProducts(): void {
    let filtered = [...this.allProducts];

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
        p.category.toLowerCase().includes(query) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(query)) ||
        (p.features && p.features.some(f => f.toLowerCase().includes(query)))
      );
    }

    // Price filter
    if (this.priceMin !== null) {
      filtered = filtered.filter(p => p.price >= this.priceMin!);
    }
    if (this.priceMax !== null) {
      filtered = filtered.filter(p => p.price <= this.priceMax!);
    }

    // Sort
    filtered = this.sortProducts(filtered);

    // Paginate
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    
    this.products.set(filtered.slice(start, end));
  }

  sortProducts(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      switch (this.selectedSort) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.name.localeCompare(b.name);
        case 'newest': return b.id - a.id;
        default: // featured
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          if (a.discount && !b.discount) return -1;
          if (!a.discount && b.discount) return 1;
          return b.rating - a.rating;
      }
    });
  }

  // ========== PAGINATION ==========
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
      this.scrollToProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
      this.scrollToProducts();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedProducts();
    this.scrollToProducts();
  }

  scrollToProducts(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const productsSection = document.querySelector('.products-supermarket');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ========== CART FUNCTIONALITY ==========
  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isCartOpen ? 'hidden' : '';
    }
  }

  onCloseCart(): void {
    this.isCartOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  getCartTotal(): number {
    return this.cartService.getTotalPrice();
  }

  addToCart(product: Product): void {
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
    this.showAddToCartNotification(product.name);
  }

  addToCartModal(): void {
    if (!this.quickViewProduct) return;
    
    const cartItem = {
      id: this.quickViewProduct.id,
      name: this.quickViewProduct.name,
      price: this.quickViewProduct.price,
      image: this.quickViewProduct.image,
      category: this.quickViewProduct.category,
      units: this.quickViewProduct.units,
      quantity: this.quickViewQuantity
    };
    
    this.cartService.addToCart(cartItem);
    this.showAddToCartNotification(this.quickViewProduct.name);
    this.closeQuickView();
  }

  buyNow(product: Product): void {
    this.addToCart(product);
    this.toggleCart();
  }

  buyNowModal(): void {
    if (!this.quickViewProduct) return;
    
    this.addToCartModal();
    this.toggleCart();
  }

  increaseQuantity(): void {
    this.quickViewQuantity++;
  }

  decreaseQuantity(): void {
    if (this.quickViewQuantity > 1) {
      this.quickViewQuantity--;
    }
  }

  // ========== QUICK VIEW ==========
  openQuickView(product: Product): void {
    this.quickViewProduct = product;
    this.quickViewQuantity = 1;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeQuickView(): void {
    this.quickViewProduct = null;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  zoomImage(action: 'in' | 'out'): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const img = document.querySelector('.main-image img') as HTMLImageElement;
    if (img) {
      const currentTransform = img.style.transform || 'scale(1)';
      const currentScale = parseFloat(currentTransform.match(/scale\(([^)]+)\)/)?.[1] || '1');
      const newScale = action === 'in' ? currentScale * 1.2 : currentScale * 0.8;
      img.style.transform = `scale(${Math.max(0.5, Math.min(3, newScale))})`;
    }
  }

  // ========== NOTIFICATIONS ==========
  private showAddToCartNotification(productName: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-check-circle"></i>
        <div>
          <div class="notification-title">${productName}</div>
          <div class="notification-subtitle">Added to cart successfully!</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ========== HELPER METHODS ==========
  getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.allProducts;
    return this.allProducts.filter(p => p.category === category);
  }

  getRandomReviewCount(): number {
    return Math.floor(Math.random() * 500) + 50;
  }

  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  getEmptyStars(rating: number): number[] {
    const full = Math.floor(rating);
    const half = this.hasHalfStar(rating) ? 1 : 0;
    return Array(5 - full - half).fill(0);
  }

  getStockClass(product: Product): string {
    if (!product.inStock) return 'out-of-stock';
    if (product.stockStatus === 'Low Stock') return 'low-stock';
    if (product.stock && product.stock < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockText(product: Product): string {
    if (!product.inStock) return 'Out of Stock';
    if (product.stockStatus === 'Low Stock') return 'Low Stock';
    if (product.stock && product.stock < 10) return `Low Stock (${product.stock} left)`;
    if (product.stock) return `In Stock (${product.stock})`;
    return 'In Stock';
  }

  // ========== IMAGE HANDLING ==========
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop';
  }

  // ========== SCROLL ==========
  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ========== WHATSAPP ==========
  openWhatsApp(): void {
    const message = `Hello Mzuri Organics! I'm interested in your products.`;
    const phone = '+254701934918';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }

  // ========== CLEAR FILTERS ==========
  clearAllFilters(): void {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.priceMin = null;
    this.priceMax = null;
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }
}