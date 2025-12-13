import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  // Change authService from private to public
  constructor(
    public authService: AuthService, // Make this public
    private router: Router
  ) {
    this.initializeForm();
  }

  editMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  currentUser: any = {};
  profileForm: any = {};

  // Kenyan counties
  kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale',
    'Kericho', 'Kakamega', 'Nyeri', 'Meru', 'Embu', 'Kisii', 'Machakos', 'Kitui',
    'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi',
    'Murang\'a', 'Kiambu', 'Kirinyaga', 'Nyandarua', 'Nyeri', 'Laikipia', 'Baringo',
    'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Homa Bay', 'Kajiado', 'Kakamega',
    'Kericho', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
    'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
    'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
    'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  // Common Kenyan crops
  commonCrops = [
    'Maize', 'Beans', 'Wheat', 'Rice', 'Coffee', 'Tea', 'Sugarcane', 'Potatoes',
    'Cassava', 'Sweet Potatoes', 'Bananas', 'Avocado', 'Mangoes', 'Oranges', 'Pineapples',
    'Tomatoes', 'Onions', 'Kale (Sukuma Wiki)', 'Cabbages', 'Carrots', 'Peas',
    'Green Grams', 'Cowpeas', 'Sorghum', 'Millet', 'Sunflower', 'Cotton', 'Tobacco'
  ];

  // Common livestock
  commonLivestock = [
    'Dairy Cattle', 'Beef Cattle', 'Goats', 'Sheep', 'Pigs', 'Chickens (Layers)',
    'Chickens (Broilers)', 'Rabbits', 'Fish (Tilapia)', 'Fish (Catfish)', 'Bees',
    'Donkeys', 'Camels'
  ];

  initializeForm() {
    // Get current user from auth service
    this.currentUser = this.authService.getCurrentUser() || {};
    
    // Initialize form with current user data
    this.profileForm = {
      fullName: this.currentUser.fullName || '',
      phoneNumber: this.currentUser.phoneNumber || '',
      email: this.currentUser.email || '',
      county: this.currentUser.county || '',
      subCounty: this.currentUser.subCounty || '',
      ward: this.currentUser.ward || '',
      village: this.currentUser.village || '',
      nearestTown: this.currentUser.nearestTown || '',
      landmark: this.currentUser.landmark || '',
      farmSize: this.currentUser.farmSize || '',
      mainCrops: this.currentUser.mainCrops || [],
      livestock: this.currentUser.livestock || [],
      farmingExperience: this.currentUser.farmingExperience || '',
      businessName: this.currentUser.businessName || '',
      businessType: this.currentUser.businessType || ''
    };
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.initializeForm(); // Reset form when canceling edit
    }
  }

  onSaveProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validate required fields
    if (!this.profileForm.fullName?.trim()) {
      this.errorMessage = 'Full name is required';
      this.isLoading = false;
      return;
    }

    if (!this.profileForm.county) {
      this.errorMessage = 'County is required';
      this.isLoading = false;
      return;
    }

    if (!this.profileForm.subCounty?.trim()) {
      this.errorMessage = 'Sub-county is required';
      this.isLoading = false;
      return;
    }

    if (!this.profileForm.ward?.trim()) {
      this.errorMessage = 'Ward is required';
      this.isLoading = false;
      return;
    }

    if (!this.profileForm.nearestTown?.trim()) {
      this.errorMessage = 'Nearest town is required';
      this.isLoading = false;
      return;
    }

    // Simulate API call
    setTimeout(() => {
      try {
        // Update user profile via auth service
        this.authService.updateProfile(this.profileForm);
        
        // Refresh current user data
        this.currentUser = this.authService.getCurrentUser() || {};
        
        this.successMessage = 'Profile updated successfully!';
        this.editMode = false;
      } catch (error) {
        this.errorMessage = 'Failed to update profile. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }, 1000);
  }

  getUserInitials(): string {
    const name = this.currentUser?.fullName || '';
    if (!name) return 'U';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  getLocationSummary(): string {
    const parts = [];
    if (this.currentUser?.county) parts.push(this.currentUser.county);
    if (this.currentUser?.subCounty) parts.push(this.currentUser.subCounty);
    if (this.currentUser?.ward) parts.push(this.currentUser.ward);
    
    if (parts.length === 0) return 'Location not set';
    return parts.join(', ');
  }

  getUserTypeDisplay(): string {
    const userType = this.currentUser?.userType || '';
    switch(userType) {
      case 'farmer': return 'Farmer';
      case 'buyer': return 'Buyer';
      case 'distributor': return 'Distributor';
      case 'agronomist': return 'Agronomist';
      default: return 'User';
    }
  }

  // Toggle crop selection
  toggleCrop(crop: string) {
    if (!this.editMode) return;
    
    const index = this.profileForm.mainCrops.indexOf(crop);
    if (index > -1) {
      this.profileForm.mainCrops.splice(index, 1);
    } else {
      this.profileForm.mainCrops.push(crop);
    }
  }

  // Toggle livestock selection
  toggleLivestock(animal: string) {
    if (!this.editMode) return;
    
    const index = this.profileForm.livestock.indexOf(animal);
    if (index > -1) {
      this.profileForm.livestock.splice(index, 1);
    } else {
      this.profileForm.livestock.push(animal);
    }
  }
}