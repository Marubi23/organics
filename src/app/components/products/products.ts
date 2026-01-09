import {
  Component,
  OnInit,
  HostListener,
  AfterViewInit,
  OnDestroy,
  computed,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CartService } from '../../services/cart';
import { TruncatePipe } from './truncate.pipe';

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
  stockLevel?: 'high' | 'medium' | 'low' | 'out';
}

interface Category {
  value: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TruncatePipe],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  // Categories for Premium Design
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

  // REAL Mzuri Products Data
  private allProducts: Product[] = [
    // Biofertilizers
    {
      id: 1,
      name: 'VermiFrass Active',
      description: 'Superior 100% organic fertilizer with active macrobes and microbes, rich in NPK, Magnesium, Calcium, Sulphur, Iron, and Manganese. Contains living microbes that enhance plant nutrition.',
      price: 850,
      originalPrice: 1000,
      image: 'images/vermifrass.jpeg',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: '5kg bag',
      inStock: true,
      stock: 45,
      stockLevel: 'high',
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
      image: 'images/bio veg.jpeg',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: false,
      isOrganic: true,
      rating: 4.7,
      units: '5kg bag',
      inStock: true,
      stock: 32,
      stockLevel: 'medium',
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
      image: 'images/bio fruity.jpeg',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '5kg bag',
      inStock: true,
      stock: 28,
      stockLevel: 'medium',
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
      image: 'images/liquid frass.jpeg',
      category: 'Biofertilizers',
      subCategory: 'Compost-based',
      isNew: false,
      isOrganic: true,
      rating: 4.6,
      units: '1L bottle',
      inStock: true,
      stock: 15,
      stockLevel: 'low',
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
      image: 'images/npk fertilizer.jpeg',
      category: 'Blended Fertilizers',
      subCategory: 'Organo-mineral',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: '5kg bag',
      inStock: true,
      stock: 50,
      stockLevel: 'high',
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
      image: 'images/chick mash.jpeg',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '25kg bag',
      inStock: true,
      stock: 25,
      stockLevel: 'medium',
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
      image: 'images/growers mash.jpeg',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: false,
      isOrganic: true,
      rating: 4.7,
      units: '25kg bag',
      inStock: true,
      stock: 38,
      stockLevel: 'high',
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
      image: 'images/broiler mash.jpeg',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '25kg bag',
      inStock: true,
      stock: 20,
      stockLevel: 'low',
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
      image: 'images/layers mash.jpeg',
      category: 'Poultry Feeds',
      subCategory: 'Chicken Feed',
      isNew: false,
      isOrganic: true,
      rating: 4.9,
      units: '25kg bag',
      inStock: true,
      stock: 42,
      stockLevel: 'high',
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
      image: 'images/pig creepers.jpeg',
      category: 'Pig Feeds',
      subCategory: 'Pig Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.7,
      units: '25kg bag',
      inStock: true,
      stock: 18,
      stockLevel: 'low',
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
      image: 'images/pig weaner.jpeg',
      category: 'Pig Feeds',
      subCategory: 'Pig Feed',
      isNew: false,
      isOrganic: true,
      rating: 4.6,
      units: '25kg bag',
      inStock: true,
      stock: 30,
      stockLevel: 'medium',
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
      image: 'images/pig finisher.jpeg',
      category: 'Pig Feeds',
      subCategory: 'Pig Feed',
      isNew: true,
      isOrganic: true,
      rating: 4.8,
      units: '25kg bag',
      inStock: true,
      stock: 22,
      stockLevel: 'low',
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
      image: 'images/dog food.jpeg',
      category: 'Pet Foods',
      subCategory: 'Pet Treats',
      isNew: true,
      isOrganic: true,
      rating: 4.9,
      units: '500g pack',
      inStock: true,
      stock: 55,
      stockLevel: 'high',
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

  // Display properties
  displayedProducts: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Filters
  selectedCategory: string = 'all';
  selectedSort: string = 'featured';
  searchQuery: string = '';
  viewMode: 'grid' | 'list' = 'grid';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 1;

  // Location
  hasDeliveryLocation: boolean = false;
  deliveryLocation: any = null;
  showLocationModal: boolean = false;
  manualLocationInput: string = '';
  locationSuggestions: any[] = [];

  // Quick View
  quickViewProduct: Product | null = null;
  quickViewQuantity: number = 1;

  // Cart
  cartCount = computed(() => this.cartService.getTotalItems());
  cartTotal = computed(() => this.cartService.getTotalPrice());
  isCartOpen = false;
  
  // Popular areas for delivery
  popularAreas: any[] = [
    { name: 'Nairobi CBD', description: 'Central Business District', deliveryTime: '2-4 hours' },
    { name: 'Westlands', description: 'Commercial area', deliveryTime: '3-5 hours' },
    { name: 'Karen', description: 'Suburban area', deliveryTime: '4-6 hours' },
    { name: 'Thika Road', description: 'Along Thika Super Highway', deliveryTime: '3-5 hours' },
    { name: 'Mombasa Road', description: 'Industrial area', deliveryTime: '4-6 hours' },
    { name: 'Kiambu Road', description: 'Residential area', deliveryTime: '3-5 hours' }
  ];

  // Loading state
  isLoading: boolean = false;
  
  // Scroll
  showScrollButton = false;

  // ADD THIS LINE to fix the Math error in template
  Math = Math;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.initializeProducts();
    this.checkExistingLocation();
    
    if (isPlatformBrowser(this.platformId)) {
      this.cartService.loadFromLocalStorage();
    }
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  // ========== INITIALIZATION ==========
  private initAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Initialize scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.journey-step, .product-card')?.forEach(el => {
      observer.observe(el);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showScrollButton = window.scrollY > 300;
    }
  }

  // ========== PRODUCT FILTERING ==========
  initializeProducts(): void {
    this.filteredProducts = [...this.allProducts];
    this.applyFilters();
    this.calculateTotalPages();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  clearCategoryFilter(): void {
    this.selectedCategory = 'all';
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allProducts];

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.features?.some((feature: string) => feature.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered = this.sortProducts(filtered, this.selectedSort);

    this.filteredProducts = filtered;
    this.updateDisplayedProducts();
  }

  sortProducts(products: Product[], sortBy: string): Product[] {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return sorted.sort((a, b) => {
          const aScore = (a.isNew ? 2 : 0) + (a.discount ? 1 : 0) + (a.rating || 0);
          const bScore = (b.isNew ? 2 : 0) + (b.discount ? 1 : 0) + (b.rating || 0);
          return bScore - aScore;
        });
    }
  }

  applySort(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.selectedSort = 'featured';
    this.currentPage = 1;
    this.applyFilters();
  }

  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
  }
  // Add to your component class
scrollToCategories() {
  const categoriesSection = document.querySelector('.premium-categories');
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: 'smooth' });
  }
}

scrollToStats() {
  const statsSection = document.querySelector('.premium-filter-bar');
  if (statsSection) {
    statsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

  // ========== PAGINATION ==========
  getPageNumbers(): number[] {
    const pages = [];
    const maxPages = 5;
    
    if (this.totalPages <= maxPages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxPages - 1);
      
      if (end - start < maxPages - 1) {
        start = Math.max(1, end - maxPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
      this.scrollToProductsSection();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedProducts();
      this.scrollToProductsSection();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedProducts();
      this.scrollToProductsSection();
    }
  }

  scrollToProductsSection(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const productsSection = document.querySelector('.premium-products-grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ========== PRODUCT HELPERS ==========
  getProductsByCategory(category: string): Product[] {
    if (category === 'all') return this.allProducts;
    return this.allProducts.filter(product => product.category === category);
  }

  get selectedCategoryLabel(): string {
    const category = this.categories.find(c => c.value === this.selectedCategory);
    return category ? category.label : 'Products';
  }

  // ========== STOCK METHODS ==========
  getStockClass(product: Product): string {
    if (!product.inStock) return 'stock-out';
    if (product.stockStatus === 'Low Stock') return 'stock-low';
    if (product.stockLevel === 'high') return 'stock-high';
    if (product.stockLevel === 'medium') return 'stock-medium';
    if (product.stockLevel === 'low') return 'stock-low';
    if (product.stock && product.stock < 10) return 'stock-low';
    return 'stock-high';
  }

  getStockText(product: Product): string {
    if (!product.inStock) return 'Out of Stock';
    if (product.stockStatus === 'Low Stock') return 'Low Stock';
    if (product.stockLevel === 'low') return 'Low Stock';
    if (product.stock && product.stock < 10) return `Low Stock (${product.stock} left)`;
    if (product.stock) return `In Stock (${product.stock})`;
    return 'In Stock';
  }

  // ========== LOCATION METHODS ==========
  checkExistingLocation(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
      try {
        this.deliveryLocation = JSON.parse(savedLocation);
        this.hasDeliveryLocation = true;
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
  }

  openLocationModal(): void {
    this.showLocationModal = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLocationModal(): void {
    this.showLocationModal = false;
    this.locationSuggestions = [];
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  useCurrentLocation(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      const mockLocation = {
        address: 'Nairobi CBD, Kenya',
        latitude: -1.2921,
        longitude: 36.8219,
        timestamp: new Date()
      };
      
      this.deliveryLocation = mockLocation;
      this.hasDeliveryLocation = true;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('deliveryLocation', JSON.stringify(mockLocation));
      }
      this.isLoading = false;
      this.closeLocationModal();
      
      this.showToast('Location set successfully!');
    }, 1500);
  }

  searchLocation(): void {
    if (!this.manualLocationInput.trim()) return;
    
    this.locationSuggestions = [
      {
        name: 'Nairobi CBD',
        address: 'Central Business District, Nairobi, Kenya',
        distance: 0.5
      },
      {
        name: 'Upper Hill',
        address: 'Upper Hill Area, Nairobi, Kenya',
        distance: 2.3
      },
      {
        name: 'Westlands',
        address: 'Westlands Commercial Area, Nairobi, Kenya',
        distance: 3.1
      },
      {
        name: 'Kilimani',
        address: 'Kilimani Residential Area, Nairobi, Kenya',
        distance: 2.8
      }
    ];
  }

  selectLocationSuggestion(suggestion: any): void {
    this.manualLocationInput = suggestion.address;
    this.confirmManualLocation();
  }

  confirmManualLocation(): void {
    if (!this.manualLocationInput.trim()) return;
    
    const location = {
      address: this.manualLocationInput,
      latitude: null,
      longitude: null,
      timestamp: new Date()
    };
    
    this.deliveryLocation = location;
    this.hasDeliveryLocation = true;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('deliveryLocation', JSON.stringify(location));
    }
    this.closeLocationModal();
    
    this.showToast('Location set successfully!');
  }

  selectPopularArea(area: any): void {
    this.manualLocationInput = `${area.name}, ${area.description}`;
    this.confirmManualLocation();
  }

  // ========== QUICK VIEW METHODS ==========
  openQuickView(product: Product): void {
    this.quickViewProduct = product;
    this.quickViewQuantity = 1;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeQuickView(): void {
    this.quickViewProduct = null;
    this.quickViewQuantity = 1;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  increaseQuantity(): void {
    if (this.quickViewQuantity < 99) {
      this.quickViewQuantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quickViewQuantity > 1) {
      this.quickViewQuantity--;
    }
  }

  // ========== CART METHODS ==========
  addToCart(product: Product): void {
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
    this.showToast(`${product.name} added to cart!`);
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
    this.showToast(`${this.quickViewProduct.name} added to cart!`);
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

  proceedToCheckout(): void {
    if (this.cartService.getTotalItems() > 0) {
      this.router.navigate(['/checkout']);
    } else {
      this.showToast('Your cart is empty!');
    }
  }

  // ========== IMAGE HANDLING ==========
  handleImageError(event: any): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1596634669955-83b7a2349dc2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }

  // ========== TOAST NOTIFICATION ==========
  showToast(message: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // ========== ESCAPE KEY HANDLER ==========
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.showLocationModal) {
      this.closeLocationModal();
    }
    if (this.quickViewProduct) {
      this.closeQuickView();
    }
    if (this.isCartOpen) {
      this.onCloseCart();
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

  // ========== SCROLL TO TOP ==========
  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ========== GET DISPLAYED END INDEX ==========
  getDisplayedEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredProducts.length);
  }
}