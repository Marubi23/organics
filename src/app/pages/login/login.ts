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
    phoneNumber: '',
    password: '',
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
    
    // Remove spaces from phone number
    const cleanPhoneNumber = this.loginData.phoneNumber.replace(/\s/g, '');
    
    // Validate
    if (!cleanPhoneNumber || !this.loginData.password) {
      this.errorMessage = 'Please enter your phone number and password';
      return;
    }

    if (cleanPhoneNumber.length !== 9) {
      this.errorMessage = 'Please enter a valid 9-digit phone number';
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      try {
        const success = this.authService.login(
          cleanPhoneNumber,
          this.loginData.password
        );

        if (success) {
          // Save remember me preference
          if (this.loginData.rememberMe) {
            localStorage.setItem('remember_me', 'true');
          }
          
          this.successMessage = 'Welcome back! Redirecting...';
          
          // Redirect with smooth transition
          setTimeout(() => {
            this.router.navigate(['/account/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = 'Invalid phone number or password';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }, 800);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  resetPassword() {
    // Navigate to password reset page
    this.router.navigate(['/account/reset-password']);
  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    // Format as XXX XXX XXX
    if (value.length > 6) {
      value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 9);
    } else if (value.length > 3) {
      value = value.substring(0, 3) + ' ' + value.substring(3, 6);
    }
    
    this.loginData.phoneNumber = value;
    
    // Clear messages when user starts typing
    this.errorMessage = '';
    this.successMessage = '';
  }
}