import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart';
import { CartComponent } from '../../pages/cart/cart';
import { ToastService } from '../../services/toast';

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
  images?: string[];
}

interface QuickViewProduct extends Product {
  quantity: number;
  mainImageIndex: number;
}

interface Review {
  id: number;
  userId?: number;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CartComponent],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [
    {
      id: 1,
      name: 'VermiFrass Active (25Kg)',
      description: 'Solid organic biofertilizer that restores soil organic matter, improves soil structure & moisture retention, and activates beneficial soil microbes. Ideal for vegetables, cereals & orchards.',
      price: 1500,
      originalPrice: 1800,
      image: 'images/vermifrassprod.jpeg',
      images: [
        'images/vermifrassprod.jpeg',
        'images/vermifrassprod.jpeg',
        'images/vermifrassprod.jpeg'
      ],
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
      images: ['images/product6.jpg'],
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
      images: ['images/product6.jpg'],
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
      images: ['images/product2.jpg'],
      category: 'Biofertilizers',
      rating: 4.8,
      units: '1 Litre Bottle',
      inStock: true,
      stock: 28,
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
      images: ['images/product2.jpg'],
      category: 'Biofertilizers',
      rating: 4.8,
      units: 'Half litre',
      inStock: true,
      stock: 28,
      features: ['Supports flowering & fruit set', 'Improves nutrient uptake', 'Boosts stress tolerance'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 6,
      name: 'Organo-Mineral VF DAP 10%',
      description: 'Organo-mineral starter fertilizer that enhances early root development, improves phosphorus efficiency, and reduces nutrient losses. Ideal for planting stage crops.',
      price: 2200,
      image: 'images/dap10.jpeg',
      images: ['images/dap10.jpeg'],
      category: 'Biofertilizers',
      rating: 4.6,
      units: '25 KG bag',
      inStock: true,
      stock: 25,
      features: ['Enhances early root development', 'Improves phosphorus efficiency', 'Reduces nutrient losses'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 7,
      name: 'Organo-Mineral VF CAN 10%',
      description: 'Nitrogen & calcium blend that supports steady vegetative growth, strengthens plant cell walls, and improves nitrogen use efficiency. Ideal for cereals, vegetables & fodder.',
      price: 1900,
      image: 'images/can10.jpeg',
      images: ['images/can10.jpeg'],
      category: 'Biofertilizers',
      rating: 4.6,
      units: '25 KG bag',
      inStock: true,
      stock: 30,
      features: ['Supports steady vegetative growth', 'Strengthens plant cell walls', 'Improves nitrogen efficiency'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 8,
      name: 'Organo-Mineral VF NPK 10%',
      description: 'Balanced NPK organo-mineral fertilizer that feeds crops & regenerates soil, improves nutrient availability, and supports all growth stages. Ideal for general crop production.',
      price: 2000,
      image: 'images/npk10.jpeg',
      images: ['images/npk10.jpeg'],
      category: 'Biofertilizers',
      rating: 4.7,
      units: '25 KG bag',
      inStock: true,
      stock: 35,
      features: ['Feeds crops & regenerates soil', 'Improves nutrient availability', 'Supports all growth stages'],
      isOrganic: true,
      isNew: false
    },
    {
      id: 9,
      name: 'Organo-Mineral VF Urea 10%',
      description: 'Controlled-release nitrogen fertilizer that reduces nitrogen losses, protects soil biology, and sustains crop growth. Ideal for maize, sugarcane & vegetables.',
      price: 2200,
      image: 'images/urea10.jpeg',
      images: ['images/urea10.jpeg'],
      category: 'Biofertilizers',
      rating: 4.6,
      units: '25 KG bag',
      inStock: true,
      stock: 20,
      features: ['Controlled-release nitrogen', 'Reduces nitrogen losses', 'Protects soil biology'],
      isOrganic: true,
      isNew: false
    }
  ];

  // Quick View State
  showQuickView = false;
  selectedProduct: QuickViewProduct | null = null;
  isZoomed = false;

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
    { value: 'Biofertilizers', label: 'Biofertilizers', icon: 'fas fa-seedling' }
  ];

  // Display
  filteredProducts: Product[] = [];
  viewMode: 'grid' | 'list' = 'grid';

  // Wishlist
  wishlistItems: number[] = [];

  // Recently Viewed
  recentlyViewed: Product[] = [];

  // Reviews
  reviews: Map<number, Review[]> = new Map();
  showReviewModal = false;
  selectedRating = 0;
  reviewComment = '';
  currentProductForReview: Product | null = null;

  Math = Math;

  constructor(
    public cartService: CartService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.filteredProducts = [...this.products];
    this.loadWishlist();
    this.loadRecentlyViewed();
    this.loadReviews();
    
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = this.cartService.getTotalItems();
      this.cartTotal = this.cartService.getTotalPrice();
    });
  }

  // ========== WISHLIST METHODS ==========
  loadWishlist() {
    const saved = localStorage.getItem('mzuri_wishlist');
    if (saved) {
      this.wishlistItems = JSON.parse(saved);
    }
  }

  isWishlisted(productId: number): boolean {
    return this.wishlistItems.includes(productId);
  }

  toggleWishlist(product: Product) {
    if (this.isWishlisted(product.id)) {
      this.wishlistItems = this.wishlistItems.filter(id => id !== product.id);
      this.toastService?.showInfo(`${product.name} removed from wishlist`);
    } else {
      this.wishlistItems.push(product.id);
      this.toastService?.showSuccess(`${product.name} added to wishlist`);
    }
    localStorage.setItem('mzuri_wishlist', JSON.stringify(this.wishlistItems));
  }

  // ========== RECENTLY VIEWED ==========
  loadRecentlyViewed() {
    const saved = localStorage.getItem('recently_viewed');
    if (saved) {
      const ids = JSON.parse(saved);
      this.recentlyViewed = this.products.filter(p => ids.includes(p.id));
    }
  }

  addToRecentlyViewed(product: Product) {
    let viewedIds = this.recentlyViewed.map(p => p.id);
    viewedIds = viewedIds.filter(id => id !== product.id);
    viewedIds.unshift(product.id);
    viewedIds = viewedIds.slice(0, 10);
    this.recentlyViewed = this.products.filter(p => viewedIds.includes(p.id));
    localStorage.setItem('recently_viewed', JSON.stringify(viewedIds));
  }

  // ========== REVIEW METHODS ==========
  loadReviews() {
    const saved = localStorage.getItem('product_reviews');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.keys(parsed).forEach(key => {
        this.reviews.set(parseInt(key), parsed[key]);
      });
    }
  }

  saveReviews() {
    const obj: any = {};
    this.reviews.forEach((value, key) => {
      obj[key] = value;
    });
    localStorage.setItem('product_reviews', JSON.stringify(obj));
  }

  openReviewModal(product: Product) {
    this.currentProductForReview = product;
    this.selectedRating = 0;
    this.reviewComment = '';
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.currentProductForReview = null;
  }

  submitReview() {
    if (!this.currentProductForReview) return;
    if (this.selectedRating === 0) {
      this.toastService?.showWarning('Please select a rating');
      return;
    }
    if (!this.reviewComment.trim() || this.reviewComment.length < 20) {
      this.toastService?.showWarning('Please write a more detailed review (minimum 20 characters)');
      return;
    }

    const review: Review = {
      id: Date.now(),
      userName: 'Customer',
      rating: this.selectedRating,
      comment: this.reviewComment,
      date: new Date(),
      verified: true
    };

    const productReviews = this.reviews.get(this.currentProductForReview.id) || [];
    productReviews.unshift(review);
    this.reviews.set(this.currentProductForReview.id, productReviews);
    this.saveReviews();

    // Update product rating
    const avgRating = this.calculateAverageRating(this.currentProductForReview.id);
    this.currentProductForReview.rating = avgRating;
    const productIndex = this.products.findIndex(p => p.id === this.currentProductForReview!.id);
    if (productIndex !== -1) {
      this.products[productIndex].rating = avgRating;
    }

    this.toastService?.showSuccess('Thank you for your review!');
    this.closeReviewModal();
  }

  calculateAverageRating(productId: number): number {
    const productReviews = this.reviews.get(productId) || [];
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, rev) => acc + rev.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  }

  getProductReviews(productId: number): Review[] {
    return this.reviews.get(productId) || [];
  }

  // ========== PRODUCT SHARING ==========
  shareProduct(product: Product) {
    const shareData = {
      title: product.name,
      text: product.description,
      url: `${window.location.origin}/products`
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${product.name} - ${shareData.url}`);
      this.toastService?.showSuccess('Product link copied to clipboard!');
    }
  }

  // ========== BULK DISCOUNT ==========
  calculateBulkDiscount(quantity: number): number {
    if (quantity >= 50) return 0.15;
    if (quantity >= 25) return 0.10;
    if (quantity >= 10) return 0.05;
    return 0;
  }

  // ========== QUICK VIEW METHODS ==========
  openQuickView(product: Product) {
    document.body.style.overflow = 'hidden';
    this.addToRecentlyViewed(product);
    this.selectedProduct = {
      ...product,
      quantity: 1,
      mainImageIndex: 0,
      images: product.images || [product.image]
    };
    this.showQuickView = true;
    this.isZoomed = false;
  }

  closeQuickView() {
    document.body.style.overflow = 'auto';
    this.showQuickView = false;
    this.selectedProduct = null;
    this.isZoomed = false;
  }

  toggleZoom() {
    if (this.selectedProduct) {
      this.isZoomed = !this.isZoomed;
    }
  }

  selectImage(index: number) {
    if (this.selectedProduct) {
      this.selectedProduct.mainImageIndex = index;
      this.isZoomed = false;
    }
  }

  nextImage() {
    if (this.selectedProduct?.images) {
      const totalImages = this.selectedProduct.images.length;
      this.selectedProduct.mainImageIndex = (this.selectedProduct.mainImageIndex + 1) % totalImages;
      this.isZoomed = false;
    }
  }

  prevImage() {
    if (this.selectedProduct?.images) {
      const totalImages = this.selectedProduct.images.length;
      this.selectedProduct.mainImageIndex = (this.selectedProduct.mainImageIndex - 1 + totalImages) % totalImages;
      this.isZoomed = false;
    }
  }

  updateQuickViewQuantity(change: number) {
    if (this.selectedProduct) {
      const newQuantity = this.selectedProduct.quantity + change;
      if (newQuantity >= 1 && newQuantity <= (this.selectedProduct.stock || 99)) {
        this.selectedProduct.quantity = newQuantity;
      }
    }
  }

  addFromQuickView() {
    if (this.selectedProduct) {
      const discount = this.calculateBulkDiscount(this.selectedProduct.quantity);
      
      for (let i = 0; i < this.selectedProduct.quantity; i++) {
        this.addToCart(this.selectedProduct);
      }
      
      if (discount > 0) {
        this.toastService?.showSuccess(`Bulk discount applied! You saved ${Math.round(discount * 100)}%`);
      }
      this.closeQuickView();
    }
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

  proceedToCheckout(): void {
    this.cartService.closeCart();
    this.router.navigate(['/checkout']);
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

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

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

  getStockIndicator(product: Product): string {
    if (!product.inStock) return 'out-of-stock';
    if (product.stock < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockStatus(product: Product): { text: string; class: string } {
    if (!product.inStock) {
      return { text: 'Out of Stock', class: 'out-of-stock' };
    }
    if (product.stock < 10) {
      return { text: `Low Stock (${product.stock} left)`, class: 'low-stock' };
    }
    return { text: 'In Stock', class: 'in-stock' };
  }

  getSelectedProductImages(): string[] {
    return this.selectedProduct?.images || [];
  }

  getSelectedProductMainImage(): string {
    return this.selectedProduct?.images?.[this.selectedProduct.mainImageIndex] || this.selectedProduct?.image || '';
  }

  hasMultipleImages(): boolean {
    return (this.selectedProduct?.images?.length || 0) > 1;
  }

  getSelectedProductQuantity(): number {
    return this.selectedProduct?.quantity || 1;
  }

  isQuantityDecreaseDisabled(): boolean {
    return !this.selectedProduct || this.selectedProduct.quantity <= 1;
  }

  isQuantityIncreaseDisabled(): boolean {
    return !this.selectedProduct || this.selectedProduct.quantity >= (this.selectedProduct.stock || 99);
  }

  getSelectedProductStock(): number {
    return this.selectedProduct?.stock || 0;
  }

  getIsWishlisted(): boolean {
    return this.selectedProduct ? this.isWishlisted(this.selectedProduct.id) : false;
  }

  // ========== KEYBOARD HANDLERS ==========
  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.showQuickView) {
      this.closeQuickView();
    }
    if (this.showReviewModal) {
      this.closeReviewModal();
    }
    if (this.cartService.getCartState()) {
      this.cartService.closeCart();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onLeftArrowPress() {
    if (this.showQuickView) {
      this.prevImage();
    }
  }

  @HostListener('document:keydown.arrowright')
  onRightArrowPress() {
    if (this.showQuickView) {
      this.nextImage();
    }
  }
}