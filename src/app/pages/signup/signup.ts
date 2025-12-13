import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  // Step tracking
  currentStep = 1;
  
  // Password visibility control
  showPassword = false;
  showConfirmPassword = false;
  
  // Form data
  signupData = {
    // Step 1: Basic Info
    fullName: '',
    phoneNumber: '',
    email: '',
    userType: 'farmer' as 'farmer' | 'buyer' | 'distributor' | 'agronomist',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    
    // Step 2: Location Details
    county: '',
    subCounty: '',
    ward: '',
    village: '',
    nearestTown: '',
    landmark: '',
    
    // Step 3: Farmer-specific
    farmSize: '',
    mainCrops: [] as string[],
    livestock: [] as string[],
    farmingExperience: ''
  };

  // Kenyan counties (shortened list)
  kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kericho', 'Kakamega', 'Nyeri', 'Meru', 'Embu', 'Kisii',
    'Machakos', 'Kitui', 'Murang\'a', 'Kiambu', 'Kirinyaga',
    'Bomet', 'Bungoma', 'Busia', 'Homa Bay', 'Kajiado',
    'Kilifi', 'Makueni', 'Migori', 'Narok', 'Siaya',
    'Taita-Taveta', 'Uasin Gishu', 'Vihiga'
  ];

  // Common Kenyan crops
  commonCrops = [
    'Maize', 'Beans', 'Wheat', 'Coffee', 'Tea', 'Sugarcane',
    'Potatoes', 'Cassava', 'Bananas', 'Avocado', 'Mangoes',
    'Tomatoes', 'Onions', 'Kale', 'Cabbages'
  ];

  // Common livestock
  commonLivestock = [
    'Dairy Cattle', 'Beef Cattle', 'Goats', 'Sheep', 'Pigs',
    'Chickens', 'Rabbits', 'Fish', 'Bees'
  ];

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Navigation between steps
  nextStep() {
    if (this.validateCurrentStep()) {
      this.currentStep++;
      this.errorMessage = '';
    }
  }

  prevStep() {
    this.currentStep--;
    this.errorMessage = '';
  }

  validateCurrentStep(): boolean {
    this.errorMessage = '';

    if (this.currentStep === 1) {
      if (!this.signupData.fullName.trim()) {
        this.errorMessage = 'Full name is required';
        return false;
      }
      if (!this.signupData.phoneNumber.trim() || this.signupData.phoneNumber.length !== 9) {
        this.errorMessage = 'Valid 9-digit phone number is required';
        return false;
      }
      if (!this.signupData.password) {
        this.errorMessage = 'Password is required';
        return false;
      }
      if (this.signupData.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters';
        return false;
      }
      if (this.signupData.password !== this.signupData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return false;
      }
      if (!this.signupData.agreeTerms) {
        this.errorMessage = 'You must agree to the terms and conditions';
        return false;
      }
    }

    if (this.currentStep === 2) {
      if (!this.signupData.county) {
        this.errorMessage = 'County is required';
        return false;
      }
      if (!this.signupData.subCounty) {
        this.errorMessage = 'Sub-county is required';
        return false;
      }
      if (!this.signupData.ward) {
        this.errorMessage = 'Ward is required';
        return false;
      }
      if (!this.signupData.nearestTown) {
        this.errorMessage = 'Nearest town is required';
        return false;
      }
    }

    return true;
  }

  onSignup() {
    if (!this.validateCurrentStep()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData: any = {
      fullName: this.signupData.fullName,
      phoneNumber: this.signupData.phoneNumber,
      email: this.signupData.email || '',
      userType: this.signupData.userType,
      county: this.signupData.county,
      subCounty: this.signupData.subCounty,
      ward: this.signupData.ward,
      village: this.signupData.village,
      nearestTown: this.signupData.nearestTown,
      landmark: this.signupData.landmark || '',
      farmSize: this.signupData.farmSize,
      mainCrops: this.signupData.mainCrops,
      livestock: this.signupData.livestock,
      farmingExperience: this.signupData.farmingExperience
    };

    // Simulate API call
    setTimeout(() => {
      try {
        const success = this.authService.signup(
          userData.phoneNumber,
          this.signupData.password,
          userData.fullName,
          userData.userType
        );

        if (success) {
          this.authService.updateProfile(userData);
          
          const loginSuccess = this.authService.login(
            userData.phoneNumber,
            this.signupData.password
          );
          
          if (loginSuccess) {
            setTimeout(() => {
              this.router.navigate(['/account/dashboard']);
            }, 1000);
          }
        } else {
          this.errorMessage = 'Phone number might already be registered.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }, 1500);
  }

  getPasswordStrength(): string {
    if (!this.signupData.password) return 'weak';
    const length = this.signupData.password.length;
    if (length < 6) return 'weak';
    if (length < 10) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch(strength) {
      case 'weak': return 'Weak password';
      case 'medium': return 'Medium strength';
      case 'strong': return 'Strong password';
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
}