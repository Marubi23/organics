const { collections } = require('../../config/firebase');

class ProductController {
  // Get all products with filters
  static async getProducts(req, res) {
    try {
      const { 
        category, 
        search, 
        minPrice, 
        maxPrice, 
        sort = 'createdAt',
        order = 'desc',
        page = 1,
        limit = 12
      } = req.query;
      
      let query = collections.products.where('isActive', '==', true);
      
      // Apply filters if provided
      if (category && category !== 'all') {
        query = query.where('category', '==', category);
      }
      
      if (minPrice) {
        query = query.where('price', '>=', parseFloat(minPrice));
      }
      
      if (maxPrice) {
        query = query.where('price', '<=', parseFloat(maxPrice));
      }
      
      // Get total count
      const countSnapshot = await query.count().get();
      const total = countSnapshot.data().count;
      
      // Execute query with pagination
      const snapshot = await query
        .orderBy(sort, order)
        .limit(parseInt(limit))
        .offset((parseInt(page) - 1) * parseInt(limit))
        .get();
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ 
          id: doc.id, 
          ...doc.data(),
          // Calculate discount percentage if originalPrice exists
          discountPercent: doc.data().originalPrice 
            ? Math.round((1 - doc.data().price / doc.data().originalPrice) * 100)
            : 0
        });
      });
      
      // Apply search filter (in-memory since Firestore doesn't support full-text)
      let filteredProducts = products;
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          (product.features && product.features.some(f => f.toLowerCase().includes(searchLower)))
        );
      }
      
      res.json({
        success: true,
        data: {
          products: filteredProducts,
          pagination: {
            total: filteredProducts.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(filteredProducts.length / parseInt(limit))
          }
        }
      });
      
    } catch (error) {
      console.error('Get products error:', error);
      
      // If no products collection exists, return mock data for development
      if (error.code === 5 || error.code === 'NOT_FOUND') {
        return res.json({
          success: true,
          data: {
            products: [],
            pagination: {
              total: 0,
              page: 1,
              limit: 12,
              totalPages: 0
            }
          }
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to get products'
      });
    }
  }
  
  // Get single product by ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const productDoc = await collections.products.doc(id).get();
      
      if (!productDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      const product = { id: productDoc.id, ...productDoc.data() };
      
      res.json({
        success: true,
        data: { product }
      });
      
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get product'
      });
    }
  }
  
  // Get products by category
  static async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      
      const snapshot = await collections.products
        .where('category', '==', category)
        .where('isActive', '==', true)
        .get();
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      
      res.json({
        success: true,
        data: { products }
      });
      
    } catch (error) {
      console.error('Get products by category error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get products'
      });
    }
  }
  
  // Search products
  static async searchProducts(req, res) {
    try {
      const { query } = req.params;
      
      // For now, get all and filter (Firestore doesn't support full-text search)
      const snapshot = await collections.products
        .where('isActive', '==', true)
        .get();
      
      const products = [];
      snapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() });
      });
      
      // Filter by search query
      const searchLower = query.toLowerCase();
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
      
      res.json({
        success: true,
        data: { products: filteredProducts }
      });
      
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search products'
      });
    }
  }
}

module.exports = ProductController;