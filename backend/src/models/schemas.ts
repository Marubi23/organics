// User Types
export interface UserData {
  id: string; // Firebase auto-ID
  userId: string; // Custom user ID format: USR-001, USR-002
  phoneNumber: string; // Primary login (format: 254712345678)
  fullName: string;
  email?: string;
  userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist';
  profileImage?: string;
  
  // Location
  county: string;
  subCounty: string;
  ward: string;
  village?: string;
  nearestTown: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Farmer-specific
  farmSize?: number; // in acres
  mainCrops?: string[];
  livestock?: string[];
  farmingExperience?: string; // years
  
  // Account
  isVerified: boolean;
  isActive: boolean;
  points: number;
  tier: 'basic' | 'premium' | 'elite';
  
  // Security
  passwordHash: string;
  resetToken?: string;
  resetExpires?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  deviceTokens?: string[]; // For push notifications
  
  // References
  defaultAddressId?: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  successfulOrders: number;
  cartItems: number;
  activeOrders: number;
  pointsEarned: number;
  pointsUsed: number;
  currentPoints: number;
  lastOrderDate?: Date;
}

// Product Types
export interface Product {
  id: string;
  productId: string; // Format: PROD-001
  name: string;
  slug: string; // URL-friendly: vermifrass-active
  description: string;
  longDescription?: string;
  
  // Categorization
  categoryId: string;
  subCategory?: string;
  tags: string[];
  
  // Pricing
  price: number; // KES
  originalPrice?: number;
  costPrice: number;
  discountPercent?: number;
  isOnSale: boolean;
  
  // Inventory
  sku: string; // Format: MZU-BF-001
  stock: number;
  minStockLevel: number;
  inStock: boolean;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  lowStockThreshold: number;
  
  // Media
  images: string[];
  featuredImage: string;
  
  // Specifications
  weight: string; // "5kg"
  units: string; // "bag", "bottle", "pack"
  composition?: string;
  application?: string;
  shelfLife?: string;
  origin: string;
  
  // Features
  features: string[];
  isOrganic: boolean;
  isNew: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  
  // Seeding (for recommendations)
  relatedProducts?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  isActive: boolean;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  parentId?: string; // For subcategories
  level: number; // 1: main, 2: subcategory
  isActive: boolean;
  featuredProducts?: string[];
  productCount: number;
  order: number; // For sorting
}

// Cart Types
export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  updatedAt: Date;
  expiresAt: Date; // Cart expires after 30 days
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  units: string;
  stockAvailable: number;
  isAvailable: boolean;
  addedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  orderId: string; // Format: ORD-2024-00123
  userId: string;
  userPhone: string;
  userName: string;
  
  // Items
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount?: number;
  pointsUsed?: number;
  total: number;
  currency: string; // "KES"
  
  // Delivery
  deliveryAddress: {
    county: string;
    subCounty: string;
    ward: string;
    village?: string;
    nearestTown: string;
    landmark?: string;
    phone: string;
    deliveryNotes?: string;
  };
  
  // Delivery Options
  deliveryMethod: 'standard' | 'express' | 'pickup';
  deliveryDate?: Date;
  deliverySlot?: 'morning' | 'afternoon' | 'evening';
  
  // Status
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'mpesa' | 'cash' | 'card';
  
  // Payment
  paymentId?: string;
  mpesaCode?: string;
  paidAmount?: number;
  paymentDate?: Date;
  
  // Tracking
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Notes
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  units: string;
  total: number;
}

// Payment Types (M-Pesa Focused)
export interface Payment {
  id: string;
  paymentId: string; // Format: PAY-2024-00123
  orderId: string;
  userId: string;
  
  // M-Pesa Details
  mpesaCode: string;
  phoneNumber: string; // Format: 254712345678
  amount: number;
  currency: string;
  
  // Status
  status: 'initiated' | 'pending' | 'completed' | 'failed' | 'refunded';
  verificationAttempts: number;
  
  // M-Pesa Response
  mpesaResponse?: {
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    ResultCode?: number;
    ResultDesc?: string;
    CallbackMetadata?: any;
  };
  
  // Timing
  initiatedAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Farm Data for Farmers
export interface FarmData {
  id: string;
  farmerId: string;
  farmName: string;
  
  // Location Details
  location: {
    county: string;
    subCounty: string;
    ward: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    size: number; // acres
    soilType?: string;
    waterSource?: string;
  };
  
  // Crops
  crops: CropData[];
  
  // Livestock
  livestock: LivestockData[];
  
  // Production
  productionRecords: ProductionRecord[];
  
  // Financial
  expenses: Expense[];
  revenues: Revenue[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface CropData {
  id: string;
  cropType: string;
  variety?: string;
  area: number; // acres
  plantingDate: Date;
  expectedHarvestDate: Date;
  status: 'planted' | 'growing' | 'harvesting' | 'harvested';
  notes?: string;
}

// Analytics Types
export interface AnalyticsDaily {
  date: string; // YYYY-MM-DD
  totalVisitors: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  popularProducts: {
    productId: string;
    name: string;
    salesCount: number;
  }[];
  userGrowth: number;
  conversionRate: number;
}

export interface UserAnalytics {
  userId: string;
  sessions: Session[];
  pageViews: PageView[];
  cartActions: CartAction[];
  purchaseHistory: Purchase[];
  lastActive: Date;
}

interface Session {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  device: string;
  location?: string;
}

interface PageView {
  page: string;
  timestamp: Date;
  duration: number;
}

interface CartAction {
  type: 'add' | 'remove' | 'update';
  productId: string;
  timestamp: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'order' | 'payment' | 'promotion' | 'system' | 'farm';
  data?: any; // Additional data
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date;
}