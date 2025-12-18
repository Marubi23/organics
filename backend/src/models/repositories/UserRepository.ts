import { collections, getTimestamp, increment } from '../../config/firebase';
import { UserData, UserStats } from '../models/schemas';

export class UserRepository {
  // Create new user
  static async createUser(userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Generate user ID
      const userCount = await this.getUserCount();
      const userId = `USR-${(userCount + 1).toString().padStart(6, '0')}`;
      
      const user: UserData = {
        ...userData,
        id: '', // Will be set by Firestore
        userId,
        isVerified: false,
        isActive: true,
        points: 100, // Welcome points
        tier: 'basic',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date()
      };
      
      // Create user document
      const userRef = collections.users.doc();
      user.id = userRef.id;
      
      await userRef.set(user);
      
      // Create user stats
      const statsRef = collections.users.doc(userRef.id).collection('stats').doc('current');
      const userStats: UserStats = {
        totalOrders: 0,
        totalSpent: 0,
        successfulOrders: 0,
        cartItems: 0,
        activeOrders: 0,
        pointsEarned: 100,
        pointsUsed: 0,
        currentPoints: 100
      };
      
      await statsRef.set(userStats);
      
      return userRef.id;
      
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
  
  // Get user by phone number
  static async getUserByPhone(phoneNumber: string): Promise<UserData | null> {
    try {
      const snapshot = await collections.users
        .where('phoneNumber', '==', phoneNumber)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as UserData;
      
    } catch (error) {
      console.error('Error getting user by phone:', error);
      throw error;
    }
  }
  
  // Update user last login
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await collections.users.doc(userId).update({
        lastLoginAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
  
  // Get user with stats
  static async getUserWithStats(userId: string): Promise<{ user: UserData; stats: UserStats }> {
    try {
      const [userDoc, statsDoc] = await Promise.all([
        collections.users.doc(userId).get(),
        collections.users.doc(userId).collection('stats').doc('current').get()
      ]);
      
      if (!userDoc.exists) throw new Error('User not found');
      
      const user = { id: userDoc.id, ...userDoc.data() } as UserData;
      const stats = statsDoc.exists ? statsDoc.data() as UserStats : this.getDefaultStats();
      
      return { user, stats };
      
    } catch (error) {
      console.error('Error getting user with stats:', error);
      throw error;
    }
  }
  
  private static async getUserCount(): Promise<number> {
    const snapshot = await collections.users.count().get();
    return snapshot.data().count;
  }
  
  private static getDefaultStats(): UserStats {
    return {
      totalOrders: 0,
      totalSpent: 0,
      successfulOrders: 0,
      cartItems: 0,
      activeOrders: 0,
      pointsEarned: 0,
      pointsUsed: 0,
      currentPoints: 0
    };
  }
}