import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    phoneNumber: '712345678', // Pre-fill for testing
    password: 'password123',  // Pre-fill for testing
    rememberMe: false
  };
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    
    // Get clean phone number (remove any spaces)
    const cleanPhone = this.loginData.phoneNumber.replace(/\s/g, '');
    
    // Validate
    if (!cleanPhone || !this.loginData.password) {
      this.errorMessage = 'Please enter your phone number and password';
      return;
    }

    if (cleanPhone.length !== 9) {
      this.errorMessage = 'Please enter a valid 9-digit phone number';
      return;
    }

    this.isLoading = true;

    // Call REAL backend API
    this.authService.login(cleanPhone, this.loginData.password, this.loginData.rememberMe)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Welcome back! Redirecting...';
          
          // Save remember me preference
          if (this.loginData.rememberMe) {
            localStorage.setItem('remember_me', 'true');
          }
          
          // Get user type from response
          const userType = response.data.user.userType;
          
          // Redirect after delay
          setTimeout(() => {
            this.redirectBasedOnUserType(userType);
          }, 1000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Invalid phone number or password';
          this.isLoading = false;
        }
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  resetPassword() {
    this.router.navigate(['/account/reset-password']);
  }

  onPhoneInput(event: any) {
    // Only allow numbers, remove anything else
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    this.loginData.phoneNumber = value;
    
    // Clear messages when user starts typing
    this.errorMessage = '';
    this.successMessage = '';
  }

  private redirectBasedOnUserType(userType: string): void {
    switch(userType) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'farmer':
        this.router.navigate(['/farmer/dashboard']);
        break;
      case 'agronomist':
        this.router.navigate(['/agronomist/dashboard']);
        break;
      case 'distributor':
        this.router.navigate(['/distributor/dashboard']);
        break;
      default:
        this.router.navigate(['/account/dashboard']);
    }
  }
}