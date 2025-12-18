const { collections } = require('../../config/firebase');
const { hashPassword, comparePassword, generateToken, formatPhoneNumber } = require('../utils/helpers');

class AuthController {
  // Login user
  static async login(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      
      // Validate input
      if (!phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          error: 'Phone number and password are required'
        });
      }
      
      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Find user by phone number
      const querySnapshot = await collections.users
        .where('phoneNumber', '==', formattedPhone)
        .limit(1)
        .get();
      
      if (querySnapshot.empty) {
        return res.status(401).json({
          success: false,
          error: 'Invalid phone number or password'
        });
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // Verify password
      const isValidPassword = await comparePassword(password, userData.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid phone number or password'
        });
      }
      
      // Check if user is active
      if (!userData.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account is deactivated'
        });
      }
      
      // Update last login
      await userDoc.ref.update({
        lastLoginAt: new Date(),
        updatedAt: new Date()
      });
      
      // Generate token
      const token = generateToken(userDoc.id, userData.userType);
      
      // Remove sensitive data
      const { passwordHash, ...safeUserData } = userData;
      
      // Get user stats
      const statsRef = userDoc.ref.collection('stats').doc('current');
      const statsDoc = await statsRef.get();
      const userStats = statsDoc.exists ? statsDoc.data() : {};
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: userDoc.id,
            ...safeUserData
          },
          stats: userStats,
          token
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  // Signup new user
  static async signup(req, res) {
    try {
      const {
        phoneNumber,
        password,
        fullName,
        email,
        userType = 'buyer',
        county,
        subCounty,
        ward,
        village,
        nearestTown,
        landmark,
        farmSize,
        mainCrops,
        livestock,
        farmingExperience
      } = req.body;
      
      // Validate required fields
      if (!phoneNumber || !password || !fullName || !county || !subCounty || !ward || !nearestTown) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }
      
      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Check if user already exists
      const existingUser = await collections.users
        .where('phoneNumber', '==', formattedPhone)
        .limit(1)
        .get();
      
      if (!existingUser.empty) {
        return res.status(409).json({
          success: false,
          error: 'Phone number already registered'
        });
      }
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Generate user ID
      const userCount = await this.getUserCount();
      const userId = `USR-${(userCount + 1).toString().padStart(6, '0')}`;
      
      // Prepare user data
      const userData = {
        userId,
        phoneNumber: formattedPhone,
        passwordHash,
        fullName,
        email: email || '',
        userType,
        county,
        subCounty,
        ward,
        village: village || '',
        nearestTown,
        landmark: landmark || '',
        farmSize: farmSize || 0,
        mainCrops: mainCrops || [],
        livestock: livestock || [],
        farmingExperience: farmingExperience || '',
        isVerified: false,
        isActive: true,
        points: 100, // Welcome points
        tier: 'basic',
        profileImage: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };
      
      // Create user document
      const userRef = collections.users.doc();
      await userRef.set(userData);
      
      // Create user stats
      const statsRef = userRef.collection('stats').doc('current');
      const userStats = {
        totalOrders: 0,
        totalSpent: 0,
        successfulOrders: 0,
        cartItems: 0,
        activeOrders: 0,
        pointsEarned: 100,
        pointsUsed: 0,
        currentPoints: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await statsRef.set(userStats);
      
      // Generate token
      const token = generateToken(userRef.id, userType);
      
      // Remove sensitive data
      const { passwordHash: _, ...safeUserData } = userData;
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: userRef.id,
            ...safeUserData
          },
          stats: userStats,
          token
        }
      });
      
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const [userDoc, statsDoc] = await Promise.all([
        collections.users.doc(userId).get(),
        collections.users.doc(userId).collection('stats').doc('current').get()
      ]);
      
      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      const userData = userDoc.data();
      const statsData = statsDoc.exists ? statsDoc.data() : {};
      
      // Remove sensitive data
      const { passwordHash, ...safeUserData } = userData;
      
      res.json({
        success: true,
        data: {
          user: {
            id: userDoc.id,
            ...safeUserData
          },
          stats: statsData
        }
      });
      
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;
      
      // Remove fields that shouldn't be updated
      delete updates.passwordHash;
      delete updates.userId;
      delete updates.phoneNumber;
      delete updates.isAdmin;
      
      // Add updatedAt timestamp
      updates.updatedAt = new Date();
      
      await collections.users.doc(userId).update(updates);
      
      // Get updated user data
      const userDoc = await collections.users.doc(userId).get();
      const userData = userDoc.data();
      
      // Remove sensitive data
      const { passwordHash, ...safeUserData } = userData;
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: userDoc.id,
            ...safeUserData
          }
        }
      });
      
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  // Logout user
  static async logout(req, res) {
    try {
      // In a real app, you might want to blacklist the token
      // For now, just return success
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
  
  // Helper: Get user count
  static async getUserCount() {
    try {
      const snapshot = await collections.users.count().get();
      return snapshot.data().count;
    } catch (error) {
      console.error('Error getting user count:', error);
      return 0;
    }
  }
}

module.exports = AuthController;