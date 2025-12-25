import { Component, ViewChild, OnInit, OnDestroy, HostListener } from '@angular/core';
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
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('step1Form') step1Form!: NgForm;
  @ViewChild('step2Form') step2Form!: NgForm;
  @ViewChild('step3Form') step3Form!: NgForm;
  
  // State
  currentStep = 1;
  showPassword = false;
  showConfirmPassword = false;
  phoneError = '';
  isLoading = false;
  
  // Data
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
  
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit() {
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    
    // Listen for keyboard events
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  ngOnDestroy() {
    // Restore scrolling
    document.body.style.overflow = '';
    document.body.style.height = '';
    document.body.style.width = '';
    
    // Remove event listener
    document.removeEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  @HostListener('window:resize')
  onResize() {
    // Force viewport recalc on resize
    this.adjustViewport();
  }
  
  private adjustViewport() {
    // Ensure full viewport coverage
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Slide position for animation
  getSlidePosition(): number {
    return (this.currentStep - 1) * -100;
  }
  
  // Loading text
  getLoadingText(): string {
    switch(this.currentStep) {
      case 1: return 'Processing...';
      case 2: return 'Saving location...';
      case 3: return 'Creating account...';
      default: return 'Loading...';
    }
  }
  
  // Keyboard handler
  private handleKeyboard(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.isLoading) {
      event.preventDefault();
      if (this.currentStep === 1) {
        this.nextStep();
      } else if (this.currentStep === 2) {
        if (!this.shouldShowFarmerStep()) {
          this.onSignup();
        } else {
          this.nextStep();
        }
      } else if (this.currentStep === 3) {
        this.onSignup();
      }
    }
    
    if (event.key === 'Escape' && this.currentStep > 1) {
      this.prevStep();
    }
  }
  
  // User type selection
  selectUserType(type: 'farmer' | 'buyer' | 'distributor' | 'agronomist') {
    if (this.isLoading) return;
    this.signupData.userType = type;
    this.clearErrors();
  }
  
  // Toggle password visibility
  togglePasswordVisibility() {
    if (this.isLoading) return;
    this.showPassword = !this.showPassword;
  }
  
  toggleConfirmPasswordVisibility() {
    if (this.isLoading) return;
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  // Format phone number
  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 9) value = value.substring(0, 9);
    
    // Format with spaces
    if (value.length > 0) {
      const parts = [];
      if (value.length <= 3) {
        parts.push(value);
      } else if (value.length <= 6) {
        parts.push(value.substring(0, 3));
        parts.push(value.substring(3));
      } else {
        parts.push(value.substring(0, 3));
        parts.push(value.substring(3, 6));
        parts.push(value.substring(6));
      }
      value = parts.join(' ');
    }
    
    this.signupData.phoneNumber = value;
    this.clearErrors();
  }
  
  // Toggle tags
  toggleCrop(crop: string) {
    if (this.isLoading) return;
    const index = this.signupData.mainCrops.indexOf(crop);
    if (index > -1) {
      this.signupData.mainCrops.splice(index, 1);
    } else {
      this.signupData.mainCrops.push(crop);
    }
  }
  
  toggleLivestock(animal: string) {
    if (this.isLoading) return;
    const index = this.signupData.livestock.indexOf(animal);
    if (index > -1) {
      this.signupData.livestock.splice(index, 1);
    } else {
      this.signupData.livestock.push(animal);
    }
  }
  
  // Step navigation
  nextStep() {
    this.clearErrors();
    
    if (this.currentStep === 1) {
      if (!this.validateStep1()) {
        if (this.step1Form) this.step1Form.control.markAllAsTouched();
        return;
      }
    } else if (this.currentStep === 2) {
      if (!this.validateStep2()) {
        if (this.step2Form) this.step2Form.control.markAllAsTouched();
        return;
      }
      
      if (!this.shouldShowFarmerStep()) {
        this.onSignup();
        return;
      }
    }
    
    this.isLoading = true;
    setTimeout(() => {
      this.currentStep++;
      this.isLoading = false;
    }, 300);
  }
  
  prevStep() {
    if (this.currentStep > 1 && !this.isLoading) {
      this.clearErrors();
      this.currentStep--;
    }
  }
  
  // Validation
  validatePhoneNumber(): boolean {
    const cleanPhone = this.signupData.phoneNumber.replace(/\D/g, '');
    
    if (!cleanPhone) {
      this.phoneError = 'Phone number required';
      return false;
    }
    
    if (cleanPhone.length !== 9) {
      this.phoneError = 'Enter 9 digits';
      return false;
    }
    
    const firstDigit = cleanPhone.charAt(0);
    if (!['7', '1'].includes(firstDigit)) {
      this.phoneError = 'Valid Kenyan number';
      return false;
    }
    
    this.phoneError = '';
    return true;
  }
  
  validateStep1(): boolean {
    if (!this.signupData.userType) {
      this.errorMessage = 'Select user type';
      return false;
    }
    
    if (!this.signupData.fullName?.trim()) {
      this.errorMessage = 'Enter full name';
      return false;
    }
    
    if (!this.validatePhoneNumber()) {
      this.errorMessage = this.phoneError;
      return false;
    }
    
    if (this.signupData.email && !this.isValidEmail(this.signupData.email)) {
      this.errorMessage = 'Valid email required';
      return false;
    }
    
    if (!this.signupData.password) {
      this.errorMessage = 'Create password';
      return false;
    }
    
    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password too short';
      return false;
    }
    
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords mismatch';
      return false;
    }
    
    if (!this.signupData.agreeTerms) {
      this.errorMessage = 'Agree to terms';
      return false;
    }
    
    return true;
  }
  
  validateStep2(): boolean {
    if (!this.signupData.county) {
      this.errorMessage = 'Select county';
      return false;
    }
    
    if (!this.signupData.subCounty?.trim()) {
      this.errorMessage = 'Enter sub-county';
      return false;
    }
    
    if (!this.signupData.ward?.trim()) {
      this.errorMessage = 'Enter ward';
      return false;
    }
    
    if (!this.signupData.nearestTown?.trim()) {
      this.errorMessage = 'Enter nearest town';
      return false;
    }
    
    return true;
  }
  
  // Signup
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
    
    if (!isValid) {
      this.shakeError();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // Prepare data
    const cleanPhone = this.signupData.phoneNumber.replace(/\D/g, '');
    
    const signupData: any = {
      fullName: this.signupData.fullName.trim(),
      phoneNumber: cleanPhone,
      email: this.signupData.email?.trim() || '',
      userType: this.signupData.userType,
      password: this.signupData.password,
      county: this.signupData.county,
      subCounty: this.signupData.subCounty.trim(),
      ward: this.signupData.ward.trim(),
      village: this.signupData.village?.trim() || '',
      nearestTown: this.signupData.nearestTown.trim(),
      landmark: this.signupData.landmark?.trim() || '',
      farmSize: this.signupData.farmSize || 0,
      mainCrops: this.signupData.mainCrops,
      livestock: this.signupData.livestock,
      farmingExperience: this.signupData.farmingExperience || '',
      agreeTerms: this.signupData.agreeTerms
    };
    
    // Call API
    this.authService.signup(signupData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Account created!';
          
          // Auto login
          setTimeout(() => {
            this.authService.login(cleanPhone, this.signupData.password, false)
              .subscribe({
                next: () => {
                  this.redirectBasedOnUserType(signupData.userType);
                },
                error: () => {
                  this.router.navigate(['/account/login']);
                }
              });
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Signup failed';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Signup error:', error);
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Connection failed';
        }
        
        if (this.errorMessage.includes('already')) {
          this.errorMessage = 'Phone already registered';
        }
        
        this.isLoading = false;
        this.shakeError();
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
  
  shouldShowFarmerStep(): boolean {
    return this.signupData.userType === 'farmer';
  }
  
  getTotalSteps(): number {
    return this.shouldShowFarmerStep() ? 3 : 2;
  }
  
  // Error animation
  private shakeError() {
    const form = document.querySelector('.form-tight');
    if (form) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  }
  
  // FIXED: Type-safe redirect method
  private redirectBasedOnUserType(userType: 'farmer' | 'buyer' | 'distributor' | 'agronomist'): void {
    let route: string;
    
    switch(userType) {
      case 'farmer':
        route = '/farmer/dashboard';
        break;
      case 'buyer':
        route = '/buyer/dashboard';
        break;
      case 'distributor':
        route = '/distributor/dashboard';
        break;
      case 'agronomist':
        route = '/agronomist/dashboard';
        break;
      default:
        route = '/dashboard';
    }
    
    this.router.navigate([route]);
  }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);