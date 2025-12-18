import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, SignupRequest } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  @ViewChild('step1Form') step1Form!: NgForm;
  @ViewChild('step2Form') step2Form!: NgForm;
  @ViewChild('step3Form') step3Form!: NgForm;
  
  currentStep = 1;
  showPassword = false;
  showConfirmPassword = false;
  phoneError = '';
  
  signupData: SignupRequest = {
    fullName: '',
    phoneNumber: '',
    email: '',
    userType: '' as 'farmer' | 'buyer' | 'distributor' | 'agronomist',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    county: '',
    subCounty: '',
    ward: '',
    village: '',
    nearestTown: '',
    landmark: '',
    farmSize: undefined,
    mainCrops: [] as string[],
    livestock: [] as string[],
    farmingExperience: ''
  };

  kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kericho', 'Kakamega', 'Nyeri', 'Meru', 'Embu', 'Kisii',
    'Machakos', 'Kitui', 'Murang\'a', 'Kiambu', 'Kirinyaga',
    'Bomet', 'Bungoma', 'Busia', 'Homa Bay', 'Kajiado',
    'Kilifi', 'Makueni', 'Migori', 'Narok', 'Siaya',
    'Taita-Taveta', 'Uasin Gishu', 'Vihiga'
  ];

  commonCrops = [
    'Maize', 'Beans', 'Wheat', 'Coffee', 'Tea', 'Sugarcane',
    'Potatoes', 'Cassava', 'Bananas', 'Avocado', 'Mangoes',
    'Tomatoes', 'Onions', 'Kale', 'Cabbages'
  ];

  commonLivestock = [
    'Dairy Cattle', 'Beef Cattle', 'Goats', 'Sheep', 'Pigs',
    'Chickens', 'Rabbits', 'Fish', 'Bees'
  ];

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  // Navigation
  nextStep() {
    this.clearErrors();
    
    if (this.currentStep === 1) {
      if (!this.validateStep1()) {
        if (this.step1Form) this.step1Form.control.markAllAsTouched();
        return;
      }
      this.currentStep++;
    } else if (this.currentStep === 2) {
      if (!this.validateStep2()) {
        if (this.step2Form) this.step2Form.control.markAllAsTouched();
        return;
      }
      
      if (!this.shouldShowFarmerStep()) {
        this.onSignup();
      } else {
        this.currentStep++;
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.clearErrors();
    }
  }

  // User type selection
  selectUserType(type: 'farmer' | 'buyer' | 'distributor' | 'agronomist') {
    this.signupData.userType = type;
    this.clearErrors();
  }

  // Validation
  validatePhoneNumber(): boolean {
    const cleanPhone = this.signupData.phoneNumber.replace(/\D/g, '');
    
    if (!cleanPhone) {
      this.phoneError = 'Phone number is required';
      return false;
    }
    
    if (cleanPhone.length !== 9) {
      this.phoneError = 'Enter 9 digits';
      return false;
    }
    
    this.phoneError = '';
    return true;
  }

  validateStep1(): boolean {
    if (!this.signupData.userType) {
      this.errorMessage = 'Select how you want to join';
      return false;
    }
    
    if (!this.signupData.fullName?.trim()) {
      this.errorMessage = 'Enter your name';
      return false;
    }
    
    if (!this.validatePhoneNumber()) {
      this.errorMessage = this.phoneError;
      return false;
    }
    
    if (!this.signupData.password) {
      this.errorMessage = 'Create a password';
      return false;
    }
    
    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password too short';
      return false;
    }
    
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords don\'t match';
      return false;
    }
    
    if (!this.signupData.agreeTerms) {
      this.errorMessage = 'Agree to terms to continue';
      return false;
    }
    
    if (this.signupData.email && !this.isValidEmail(this.signupData.email)) {
      this.errorMessage = 'Enter valid email';
      return false;
    }
    
    return true;
  }

  validateStep2(): boolean {
    if (!this.signupData.county) {
      this.errorMessage = 'Select county';
      return false;
    }
    if (!this.signupData.subCounty) {
      this.errorMessage = 'Enter sub-county';
      return false;
    }
    if (!this.signupData.ward) {
      this.errorMessage = 'Enter ward';
      return false;
    }
    if (!this.signupData.nearestTown) {
      this.errorMessage = 'Enter nearest town';
      return false;
    }
    return true;
  }

  // Main signup function
  onSignup() {
    this.clearErrors();
    
    let isValid = false;
    if (this.currentStep === 1) {
      isValid = this.validateStep1();
    } else if (this.currentStep === 2) {
      isValid = this.validateStep2();
    } else if (this.currentStep === 3) {
      isValid = true;
    }
    
    if (!isValid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Clean data
    const cleanPhoneNumber = this.signupData.phoneNumber.replace(/\D/g, '');
    
    // Prepare data for backend
    const signupData: any = {
      fullName: this.signupData.fullName.trim(),
      phoneNumber: cleanPhoneNumber,
      email: this.signupData.email?.trim() || '',
      userType: this.signupData.userType,
      password: this.signupData.password,
      county: this.signupData.county,
      subCounty: this.signupData.subCounty.trim(),
      ward: this.signupData.ward.trim(),
      village: this.signupData.village?.trim() || '',
      nearestTown: this.signupData.nearestTown.trim(),
      landmark: this.signupData.landmark?.trim() || '',
      farmSize: this.signupData.farmSize ? parseFloat(this.signupData.farmSize.toString()) : 0,
      mainCrops: this.signupData.mainCrops || [],
      livestock: this.signupData.livestock || [],
      farmingExperience: this.signupData.farmingExperience || '',
      agreeTerms: this.signupData.agreeTerms
    };

    console.log('Sending to backend:', signupData);

    // Call backend
    this.authService.signup(signupData)
      .subscribe({
        next: (response: any) => {
          console.log('Signup response:', response);
          
          if (response.success) {
            this.successMessage = 'Account created! Logging you in...';
            
            // Auto login
            this.authService.login(cleanPhoneNumber, this.signupData.password, false)
              .subscribe({
                next: (loginResponse: any) => {
                  setTimeout(() => {
                    this.redirectBasedOnUserType(signupData.userType);
                  }, 1500);
                },
                error: () => {
                  this.successMessage = 'Account created! Please sign in.';
                  setTimeout(() => {
                    this.router.navigate(['/account/login']);
                  }, 2000);
                }
              });
          } else {
            this.errorMessage = response.message || 'Signup failed';
            this.isLoading = false;
          }
        },
        error: (error: any) => {
          console.error('Signup error:', error);
          
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Signup failed. Try again.';
          }
          
          if (this.errorMessage.includes('already registered')) {
            this.errorMessage = 'Phone already registered. Sign in instead.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Check backend.';
          }
          
          this.isLoading = false;
        }
      });
  }

  // Helper methods
  clearErrors() {
    this.errorMessage = '';
    this.phoneError = '';
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getPasswordStrength(): string {
    if (!this.signupData.password) return 'weak';
    
    const length = this.signupData.password.length;
    const hasUpperCase = /[A-Z]/.test(this.signupData.password);
    const hasLowerCase = /[a-z]/.test(this.signupData.password);
    const hasNumbers = /\d/.test(this.signupData.password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(this.signupData.password);
    
    let strength = 0;
    if (length >= 8) strength++;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecial) strength++;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch(strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.getTotalSteps()) * 100;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleCrop(crop: string) {
    const index = this.signupData.mainCrops.indexOf(crop);
    if (index > -1) {
      this.signupData.mainCrops.splice(index, 1);
    } else {
      this.signupData.mainCrops.push(crop);
    }
  }

  toggleLivestock(animal: string) {
    const index = this.signupData.livestock.indexOf(animal);
    if (index > -1) {
      this.signupData.livestock.splice(index, 1);
    } else {
      this.signupData.livestock.push(animal);
    }
  }

  shouldShowFarmerStep(): boolean {
    return this.signupData.userType === 'farmer';
  }

  getTotalSteps(): number {
    return this.shouldShowFarmerStep() ? 3 : 2;
  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.substring(0, 9);
    this.signupData.phoneNumber = value;
    this.clearErrors();
  }

  private redirectBasedOnUserType(userType: string): void {
    switch(userType) {
      case 'farmer': this.router.navigate(['/farmer/dashboard']); break;
      case 'buyer': this.router.navigate(['/buyer/dashboard']); break;
      case 'distributor': this.router.navigate(['/distributor/dashboard']); break;
      case 'agronomist': this.router.navigate(['/agronomist/dashboard']); break;
      default: this.router.navigate(['/account/dashboard']);
    }
  }
}