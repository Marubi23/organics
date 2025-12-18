import { collections, getTimestamp } from '../../config/firebase';
import { Product, Category } from '../models/schemas';

export class ProductRepository {
  // Get all products with pagination
  static async getProducts(
    filters: {
      categoryId?: string;
      isFeatured?: boolean;
      isNew?: boolean;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      search?: string;
    },
    pagination: {
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: 'asc' | 'desc';
    }
  ): Promise<{ products: Product[]; total: number }> {
    try {
      let query: any = collections.products.where('isActive', '==', true);
      
      // Apply filters
      if (filters.categoryId) {
        query = query.where('categoryId', '==', filters.categoryId);
      }
      
      if (filters.isFeatured !== undefined) {
        query = query.where('isFeatured', '==', filters.isFeatured);
      }
      
      if (filters.isNew !== undefined) {
        query = query.where('isNew', '==', filters.isNew);
      }
      
      if (filters.inStock !== undefined) {
        query = query.where('inStock', '==', filters.inStock);
      }
      
      if (filters.minPrice !== undefined) {
        query = query.where('price', '>=', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        query = query.where('price', '<=', filters.maxPrice);
      }
      
      // Apply sorting
      const sortField = pagination.sortBy || 'createdAt';
      query = query.orderBy(sortField, pagination.sortOrder || 'desc');
      
      // Get total count
      const countSnapshot = await query.count().get();
      const total = countSnapshot.data().count;
      
      // Apply pagination
      const offset = (pagination.page - 1) * pagination.limit;
      if (offset > 0) {
        const snapshot = await query.limit(offset).get();
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
      
      query = query.limit(pagination.limit);
      
      // Execute query
      const snapshot = await query.get();
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Apply search filter after fetching (Firestore doesn't support full-text search)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
        
        return {
          products: filtered,
          total: filtered.length
        };
      }
      
      return { products, total };
      
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }
  
  // Get product by ID
  static async getProductById(productId: string): Promise<Product | null> {
    try {
      const doc = await collections.products.doc(productId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } as Product : null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }
  
  // Update stock after purchase
  static async updateStock(productId: string, quantity: number): Promise<void> {
    try {
      const productRef = collections.products.doc(productId);
      const productDoc = await productRef.get();
      
      if (!productDoc.exists) throw new Error('Product not found');
      
      const product = productDoc.data() as Product;
      const newStock = product.stock - quantity;
      const isAvailable = newStock > 0;
      const stockStatus = this.getStockStatus(newStock, product.lowStockThreshold);
      
      await productRef.update({
        stock: newStock,
        inStock: isAvailable,
        stockStatus,
        updatedAt: new Date()
      });
      
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
  
  private static getStockStatus(stock: number, threshold: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= threshold) return 'low_stock';
    return 'in_stock';
  }
}