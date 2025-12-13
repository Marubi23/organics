import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-modal-overlay" (click)="closeModal()">
      <div class="auth-modal" (click)="$event.stopPropagation()">
        <div class="auth-header">
          <h3>{{ isLoginMode ? 'Login to Your Account' : 'Create Account' }}</h3>
          <button class="close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="auth-body">
          <!-- Toggle between Login/Signup -->
          <div class="auth-toggle">
            <button 
              class="toggle-btn" 
              [class.active]="isLoginMode"
              (click)="isLoginMode = true">
              Login
            </button>
            <button 
              class="toggle-btn" 
              [class.active]="!isLoginMode"
              (click)="isLoginMode = false">
              Sign Up
            </button>
          </div>

          <!-- Login Form -->
          <form *ngIf="isLoginMode" (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="form-group">
              <label for="loginPhone">Phone Number</label>
              <div class="input-with-prefix">
                <span class="input-prefix">+254</span>
                <input 
                  type="tel" 
                  id="loginPhone" 
                  name="phone"
                  [(ngModel)]="loginPhone"
                  placeholder="7XX XXX XXX"
                  required
                  pattern="[0-9]{9}"
                  maxlength="9"
                >
              </div>
              <small class="input-hint">Enter your 9-digit Safaricom number</small>
            </div>

            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input 
                type="password" 
                id="loginPassword"
                name="password"
                [(ngModel)]="loginPassword"
                placeholder="Enter your password"
                required
                minlength="6"
              >
            </div>

            <button 
              type="submit" 
              class="btn-auth-submit"
              [disabled]="loginForm.invalid || isLoading">
              <i class="fas fa-sign-in-alt"></i>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>

            <div class="auth-links">
              <a href="#" class="auth-link" (click)="forgotPassword()">Forgot Password?</a>
              <span class="auth-divider">|</span>
              <a href="#" class="auth-link" (click)="isLoginMode = false; $event.preventDefault()">Create Account</a>
            </div>
          </form>

          <!-- Signup Form -->
          <form *ngIf="!isLoginMode" (ngSubmit)="onSignup()" #signupForm="ngForm">
            <div class="form-group">
              <label for="fullName">Full Name *</label>
              <input 
                type="text" 
                id="fullName"
                name="fullName"
                [(ngModel)]="signupData.fullName"
                placeholder="Enter your full name"
                required
              >
            </div>

            <div class="form-group">
              <label for="signupPhone">Phone Number *</label>
              <div class="input-with-prefix">
                <span class="input-prefix">+254</span>
                <input 
                  type="tel" 
                  id="signupPhone"
                  name="phone"
                  [(ngModel)]="signupData.phoneNumber"
                  placeholder="7XX XXX XXX"
                  required
                  pattern="[0-9]{9}"
                  maxlength="9"
                >
              </div>
              <small class="input-hint">This will be your login ID</small>
            </div>

            <div class="form-group">
              <label for="email">Email (Optional)</label>
              <input 
                type="email" 
                id="email"
                name="email"
                [(ngModel)]="signupData.email"
                placeholder="your.email@example.com"
              >
            </div>

            <div class="form-group">
              <label for="signupPassword">Password *</label>
              <input 
                type="password" 
                id="signupPassword"
                name="password"
                [(ngModel)]="signupData.password"
                placeholder="Create a strong password"
                required
                minlength="6"
              >
              <small class="input-hint">Minimum 6 characters</small>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password *</label>
              <input 
                type="password" 
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="signupData.confirmPassword"
                placeholder="Confirm your password"
                required
                minlength="6"
              >
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  name="isFarmer"
                  [(ngModel)]="signupData.isFarmer"
                >
                <span>I am a farmer</span>
              </label>
            </div>

            <div class="terms-agreement">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  name="agreeTerms"
                  [(ngModel)]="signupData.agreeTerms"
                  required
                >
                <span>
                  I agree to the 
                  <a href="/terms" target="_blank" class="terms-link">Terms of Service</a> 
                  and 
                  <a href="/privacy" target="_blank" class="terms-link">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              class="btn-auth-submit"
              [disabled]="signupForm.invalid || !signupData.agreeTerms || isLoading">
              <i class="fas fa-user-plus"></i>
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </button>

            <div class="auth-links">
              <span>Already have an account?</span>
              <a href="#" class="auth-link" (click)="isLoginMode = true; $event.preventDefault()">Login here</a>
            </div>
          </form>
        </div>

        <!-- Quick Location Notice -->
        <div class="location-notice">
          <i class="fas fa-map-marker-alt"></i>
          <span>We'll ask for your location details later for delivery</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    .auth-modal {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }

    .auth-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
      background: linear-gradient(135deg, #2E7D32, #388E3C);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .auth-header h3 {
      margin: 0;
      font-size: 1.3rem;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .auth-body {
      padding: 25px;
    }

    .auth-toggle {
      display: flex;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 4px;
      margin-bottom: 25px;
    }

    .toggle-btn {
      flex: 1;
      padding: 12px;
      border: none;
      background: transparent;
      color: #666;
      font-weight: 600;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .toggle-btn.active {
      background: white;
      color: #2E7D32;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px 15px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #2E7D32;
    }

    .input-with-prefix {
      display: flex;
      align-items: center;
    }

    .input-prefix {
      background: #f5f5f5;
      padding: 12px 15px;
      border: 2px solid #ddd;
      border-right: none;
      border-radius: 8px 0 0 8px;
      color: #666;
    }

    .input-with-prefix input {
      border-radius: 0 8px 8px 0;
    }

    .input-hint {
      display: block;
      margin-top: 5px;
      color: #666;
      font-size: 0.85rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #333;
    }

    .checkbox-label input {
      margin-right: 10px;
      width: auto;
    }

    .terms-agreement {
      margin: 20px 0;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .terms-link {
      color: #2E7D32;
      text-decoration: none;
      font-weight: 600;
    }

    .terms-link:hover {
      text-decoration: underline;
    }

    .btn-auth-submit {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #2E7D32, #388E3C);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-auth-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
    }

    .btn-auth-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-links {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .auth-link {
      color: #2E7D32;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-link:hover {
      text-decoration: underline;
    }

    .auth-divider {
      margin: 0 10px;
      color: #999;
    }

    .location-notice {
      padding: 15px 25px;
      background: #E8F5E9;
      border-top: 1px solid #C8E6C9;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #2E7D32;
      font-size: 0.9rem;
    }

    .location-notice i {
      font-size: 1.1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .auth-modal {
        width: 95%;
        margin: 10px;
      }
      
      .auth-body {
        padding: 20px;
      }
      
      .auth-header h3 {
        font-size: 1.1rem;
      }
    }
  `]
})
export class AuthModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  isLoginMode = true;
  isLoading = false;
  
  // Login data
  loginPhone = '';
  loginPassword = '';
  
  // Signup data
  signupData = {
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    isFarmer: false,
    agreeTerms: false
  };

  closeModal(): void {
    this.close.emit();
  }

  onLogin(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // For demo, we'll just consider any login successful
      // In real app, call authService.login()
      this.isLoading = false;
      this.loginSuccess.emit();
      this.closeModal();
    }, 1000);
  }

  onSignup(): void {
    if (this.signupData.password !== this.signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // For demo, we'll just consider any signup successful
      // In real app, call authService.signup()
      this.isLoading = false;
      
      // Switch to login mode
      this.isLoginMode = true;
      this.loginPhone = this.signupData.phoneNumber;
      this.loginPassword = this.signupData.password;
      
      // Show success message
      alert('Account created successfully! Please login.');
    }, 1500);
  }

  forgotPassword(): void {
    alert('Password reset feature coming soon! Contact support for now.');
  }
}