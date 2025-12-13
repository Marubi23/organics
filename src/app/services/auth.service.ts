import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  
  // User type for Mzuri Organics
  userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist';
  
  // Location details (Kenyan context)
  county: string;
  subCounty: string;
  ward: string;
  village: string;
  nearestTown: string;
  landmark?: string;
  
  // Farmer-specific fields (optional - only for farmers)
  farmSize?: string;
  mainCrops?: string[];
  livestock?: string[];
  farmingExperience?: number;
  
  // Business details (for buyers/distributors)
  businessName?: string;
  businessType?: string;
  
  // Dates and status
  createdAt: Date;
  verified: boolean;
  lastLogin?: Date;
  points?: number; // Loyalty points
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user exists in localStorage on init
    const savedUser = localStorage.getItem('mzuri_user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Signup with user type
  signup(
    phoneNumber: string, 
    password: string, 
    fullName: string,
    userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist' = 'buyer'
  ): boolean {
    const user: User = {
      id: 'user_' + Date.now(),
      fullName,
      phoneNumber,
      userType,
      county: '',
      subCounty: '',
      ward: '',
      village: '',
      nearestTown: '',
      createdAt: new Date(),
      verified: false,
      points: 100 // Starting points
    };

    localStorage.setItem('mzuri_user', JSON.stringify(user));
    localStorage.setItem('mzuri_token', 'dummy_token_' + Date.now());
    
    this.currentUserSubject.next(user);
    return true;
  }

  // Login
  login(phoneNumber: string, password: string): boolean {
    // For demo, accept any password with specific user types
    // You can customize this based on phone number
    let userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist' = 'buyer';
    let county = 'Nairobi';
    let fullName = 'Demo User';
    
    // Demo data based on phone number
    if (phoneNumber.startsWith('7')) {
      userType = 'farmer';
      county = 'Kiambu';
      fullName = 'John Kamau';
    } else if (phoneNumber.startsWith('1')) {
      userType = 'agronomist';
      county = 'Nakuru';
      fullName = 'Dr. Sarah Mwangi';
    }

    const user: User = {
      id: 'user_demo',
      fullName,
      phoneNumber,
      userType,
      county,
      subCounty: userType === 'farmer' ? 'Lari' : 'Westlands',
      ward: userType === 'farmer' ? 'Kinale' : 'Kangemi',
      village: userType === 'farmer' ? 'Kinale' : 'Mountain View',
      nearestTown: userType === 'farmer' ? 'Limuru' : 'Westlands',
      
      // Farmer-specific demo data
      ...(userType === 'farmer' && {
        farmSize: '2.5',
        mainCrops: ['Maize', 'Beans', 'Kale', 'Avocado'],
        livestock: ['Chickens', 'Dairy Cows'],
        farmingExperience: 5
      }),
      
      // Agronomist-specific demo data
      ...(userType === 'agronomist' && {
        businessName: 'Greenfield Agronomy Services',
        businessType: 'Consultancy'
      }),
      
      createdAt: new Date(),
      verified: true,
      lastLogin: new Date(),
      points: userType === 'farmer' ? 450 : 250
    };

    localStorage.setItem('mzuri_user', JSON.stringify(user));
    localStorage.setItem('mzuri_token', 'dummy_token');
    
    this.currentUserSubject.next(user);
    return true;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('mzuri_user');
    localStorage.removeItem('mzuri_token');
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Update user profile
  updateProfile(updates: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('mzuri_user', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  // Add points to user (for loyalty program)
  addPoints(points: number): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        points: (currentUser.points || 0) + points 
      };
      localStorage.setItem('mzuri_user', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  // Check if user is a farmer
  isFarmer(): boolean {
    return this.getCurrentUser()?.userType === 'farmer';
  }

  // Check if user is a buyer
  isBuyer(): boolean {
    return this.getCurrentUser()?.userType === 'buyer';
  }

  // Check if user is an agronomist
  isAgronomist(): boolean {
    return this.getCurrentUser()?.userType === 'agronomist';
  }

  // Check if user is a distributor
  isDistributor(): boolean {
    return this.getCurrentUser()?.userType === 'distributor';
  }

  // Get user type display name
  getUserTypeDisplay(): string {
    const user = this.getCurrentUser();
    if (!user) return 'Guest';
    
    switch(user.userType) {
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Customer';
      case 'distributor': return 'Distributor';
      case 'agronomist': return 'Agronomist';
      default: return 'User';
    }
  }

  // Get user's location summary
  getLocationSummary(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    
    return `${user.village}, ${user.ward}, ${user.subCounty}, ${user.county}`;
  }
}