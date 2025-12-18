import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// ============ INTERFACES ============
export interface User {
  userId: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist' | 'admin';
  county: string;
  subCounty: string;
  ward: string;
  village?: string;
  nearestTown: string;
  landmark?: string;
  farmSize?: number | string; // Allow both string and number
  mainCrops?: string[];
  livestock?: string[];
  farmingExperience?: string;
  isVerified: boolean;
  isActive: boolean;
  points: number;
  tier: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  phoneNumber: string; // Format: 712345678 (no spaces)
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  fullName: string;
  phoneNumber: string; // Format: 712345678 (no spaces)
  email?: string;
  userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist';
  password: string;
  confirmPassword?: string; // Frontend only - remove before sending
  county: string;
  subCounty: string;
  ward: string;
  village?: string;
  nearestTown: string;
  landmark?: string;
  farmSize?: number;
  mainCrops: string[]; // Changed from optional to required
  livestock: string[]; // Changed from optional to required
  farmingExperience?: string;
  agreeTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
  timestamp: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update this to match your backend URL
  private apiUrl = 'http://localhost:5000/api/v1';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  // ==================== PUBLIC METHODS ====================

  /**
   * Register a new user
   */
  signup(signupData: SignupRequest): Observable<AuthResponse> {
    this.setLoading(true);
    
    // Clean phone number and prepare data for backend
    const cleanPhone = signupData.phoneNumber.replace(/\D/g, '');
    
    // Ensure arrays are initialized
    const mainCrops = signupData.mainCrops || [];
    const livestock = signupData.livestock || [];
    
    // Create backend payload (remove frontend-only fields)
    const backendData = {
      fullName: signupData.fullName,
      phoneNumber: cleanPhone,
      email: signupData.email || '',
      userType: signupData.userType,
      password: signupData.password,
      county: signupData.county,
      subCounty: signupData.subCounty,
      ward: signupData.ward,
      village: signupData.village || '',
      nearestTown: signupData.nearestTown,
      landmark: signupData.landmark || '',
      farmSize: signupData.farmSize || 0,
      mainCrops: mainCrops,
      livestock: livestock,
      farmingExperience: signupData.farmingExperience || '',
      agreeTerms: signupData.agreeTerms
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/signup`, backendData)
      .pipe(
        tap(response => {
          if (response.success && response.data?.token) {
            this.storeAuthData(response.data.token, response.data.user);
            this.setLoading(false);
          }
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Login existing user
   */
  login(phoneNumber: string, password: string, rememberMe: boolean = false): Observable<AuthResponse> {
    this.setLoading(true);
    
    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    const loginData: LoginRequest = {
      phoneNumber: cleanPhone,
      password,
      rememberMe
    };
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        tap(response => {
          if (response.success && response.data?.token) {
            this.storeAuthData(response.data.token, response.data.user, rememberMe);
            this.setLoading(false);
          }
        }),
        catchError(error => {
          this.setLoading(false);
          return this.handleError(error);
        })
      );
  }

  /**
   * Get user profile
   */
  getProfile(): Observable<ProfileResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get<ProfileResponse>(`${this.apiUrl}/auth/profile`, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.updateStoredUser(response.data);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Update user profile
   */
  updateProfile(userData: Partial<User>): Observable<ProfileResponse> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put<ProfileResponse>(`${this.apiUrl}/auth/profile`, userData, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.updateStoredUser(response.data);
          }
        }),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Logout
   */
  logout(): void {
    // Call backend logout if needed
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      
      this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers })
        .subscribe({
          next: () => console.log('Logged out from backend'),
          error: (err) => console.warn('Backend logout error:', err)
        });
    }
    
    // Clear local storage
    this.clearAuthData();
    
    // Navigate to login
    this.router.navigate(['/account/login']);
  }

  /**
   * Check authentication status
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Alias for isAuthenticated (for backward compatibility)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    // Check remember me preference
    if (localStorage.getItem('remember_me') === 'true') {
      return localStorage.getItem('mzuri_token');
    }
    return sessionStorage.getItem('mzuri_token');
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check user type
   */
  isFarmer(): boolean {
    return this.getCurrentUser()?.userType === 'farmer';
  }

  isBuyer(): boolean {
    return this.getCurrentUser()?.userType === 'buyer';
  }

  isDistributor(): boolean {
    return this.getCurrentUser()?.userType === 'distributor';
  }

  isAgronomist(): boolean {
    return this.getCurrentUser()?.userType === 'agronomist';
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.userType === 'admin';
  }

  // ==================== PRIVATE METHODS ====================

  private storeAuthData(token: string, user: User, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('mzuri_token', token);
    storage.setItem('mzuri_user', JSON.stringify(user));
    
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    } else {
      localStorage.removeItem('remember_me');
    }
    
    this.currentUserSubject.next(user);
  }

  private updateStoredUser(user: User): void {
    const currentToken = this.getToken();
    const rememberMe = localStorage.getItem('remember_me') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem('mzuri_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): void {
    let userData: string | null = null;
    
    // Check where user is stored
    if (localStorage.getItem('remember_me') === 'true') {
      userData = localStorage.getItem('mzuri_user');
    } else {
      userData = sessionStorage.getItem('mzuri_user');
    }
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error loading user:', error);
        this.clearAuthData();
      }
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('mzuri_token');
    localStorage.removeItem('mzuri_user');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('mzuri_token');
    sessionStorage.removeItem('mzuri_user');
    this.currentUserSubject.next(null);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    console.error('AuthService Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  private setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
}