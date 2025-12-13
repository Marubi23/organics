import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface FarmPlot {
  id: string;
  name: string;
  size: number; // in acres
  location: string;
  soilType: string;
  crops: CropCycle[];
  lastSoilTest?: Date;
  soilTestResults?: string;
}

interface CropCycle {
  id: string;
  crop: string;
  variety: string;
  plantingDate: Date;
  harvestDate?: Date;
  status: 'planted' | 'growing' | 'harvesting' | 'harvested';
  yield?: number; // in kg
  notes: string;
  inputs: FarmInput[];
}

interface FarmInput {
  id: string;
  name: string;
  type: 'fertilizer' | 'pesticide' | 'herbicide' | 'seed' | 'other';
  applicationDate: Date;
  quantity: number;
  unit: string;
  cost: number;
}

interface Livestock {
  id: string;
  type: string;
  breed: string;
  quantity: number;
  age: string;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  lastVetVisit?: Date;
  production?: {
    milk?: number; // liters per day
    eggs?: number; // eggs per day
    weight?: number; // kg
  };
}

@Component({
  selector: 'app-farm-data',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './farm-data.html',
  styleUrls: ['./farm-data.css']
})
export class FarmDataComponent implements OnInit {
  currentUser: any;
  
  // Farm data
  farmPlots: FarmPlot[] = [];
  livestock: Livestock[] = [];
  cropCycles: CropCycle[] = [];
  
  // Add new forms
  newPlot = {
    name: '',
    size: 0,
    location: '',
    soilType: 'loam',
    soilTestDate: ''
  };
  
  newCrop = {
    plotId: '',
    crop: '',
    variety: '',
    plantingDate: '',
    notes: ''
  };
  
  newLivestock = {
    type: '',
    breed: '',
    quantity: 1,
    age: '',
    healthStatus: 'good' as 'excellent' | 'good' | 'fair' | 'poor'
  };
  
  // View mode
  activeTab: 'plots' | 'crops' | 'livestock' | 'analytics' = 'plots';
  
  // Soil types
  soilTypes = ['Loam', 'Clay', 'Sandy', 'Silt', 'Clay Loam', 'Sandy Loam'];
  
  // Common crops
  commonCrops = ['Maize', 'Beans', 'Wheat', 'Coffee', 'Tea', 'Avocado', 'Mangoes', 'Tomatoes', 'Kale', 'Cabbages'];
  
  // Livestock types
  livestockTypes = ['Dairy Cattle', 'Beef Cattle', 'Goats', 'Sheep', 'Pigs', 'Chickens', 'Rabbits'];
  
  // Loading state
  isLoading = true;
  
  // Analytics data
  analytics = {
    totalLand: 0,
    activeCrops: 0,
    totalLivestock: 0,
    monthlyYield: 0,
    inputCosts: 0,
    estimatedRevenue: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/account/login']);
      return;
    }
    
    if (!this.authService.isFarmer()) {
      this.router.navigate(['/account/dashboard']);
      return;
    }
    
    this.loadFarmData();
  }

  loadFarmData() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Mock farm data
      this.farmPlots = [
        {
          id: '1',
          name: 'Main Field',
          size: 2.5,
          location: 'North side near river',
          soilType: 'Loam',
          crops: [
            {
              id: 'c1',
              crop: 'Maize',
              variety: 'DH04',
              plantingDate: new Date('2024-01-10'),
              status: 'growing',
              notes: 'Planted after first rains',
              inputs: [
                { id: 'i1', name: 'Liquid NPK Plus', type: 'fertilizer', applicationDate: new Date('2024-01-20'), quantity: 10, unit: 'L', cost: 700 }
              ]
            }
          ],
          lastSoilTest: new Date('2023-12-15'),
          soilTestResults: 'pH: 6.5, Nitrogen: Medium, Phosphorus: High, Potassium: Medium'
        },
        {
          id: '2',
          name: 'Vegetable Garden',
          size: 0.5,
          location: 'Behind house',
          soilType: 'Clay Loam',
          crops: [
            {
              id: 'c2',
              crop: 'Kale',
              variety: 'Local',
              plantingDate: new Date('2024-01-05'),
              status: 'harvesting',
              yield: 50,
              notes: 'Weekly harvest for market',
              inputs: [
                { id: 'i2', name: 'Organic Compost', type: 'fertilizer', applicationDate: new Date('2024-01-01'), quantity: 100, unit: 'kg', cost: 500 }
              ]
            }
          ]
        }
      ];
      
      this.livestock = [
        {
          id: 'l1',
          type: 'Dairy Cattle',
          breed: 'Friesian',
          quantity: 3,
          age: '2-4 years',
          healthStatus: 'good',
          lastVetVisit: new Date('2024-01-10'),
          production: { milk: 15 }
        },
        {
          id: 'l2',
          type: 'Chickens',
          breed: 'Kienyeji',
          quantity: 50,
          age: '6 months',
          healthStatus: 'excellent',
          production: { eggs: 40 }
        }
      ];
      
      // Extract all crop cycles
      this.cropCycles = this.farmPlots.flatMap(plot => plot.crops);
      
      // Calculate analytics
      this.calculateAnalytics();
      
      this.isLoading = false;
    }, 1500);
  }

  calculateAnalytics() {
    // Total land
    this.analytics.totalLand = this.farmPlots.reduce((total, plot) => total + plot.size, 0);
    
    // Active crops
    this.analytics.activeCrops = this.cropCycles.filter(crop => crop.status !== 'harvested').length;
    
    // Total livestock
    this.analytics.totalLivestock = this.livestock.reduce((total, animal) => total + animal.quantity, 0);
    
    // Monthly yield (mock calculation)
    this.analytics.monthlyYield = this.cropCycles
      .filter(crop => crop.status === 'harvesting' || crop.status === 'harvested')
      .reduce((total, crop) => total + (crop.yield || 0), 0);
    
    // Input costs (mock)
    this.analytics.inputCosts = this.farmPlots
      .flatMap(plot => plot.crops.flatMap(crop => crop.inputs))
      .reduce((total, input) => total + input.cost, 0);
    
    // Estimated revenue (mock)
    this.analytics.estimatedRevenue = this.analytics.monthlyYield * 50; // Assuming 50 KSh per kg
  }

  // Add new farm plot
  addPlot() {
    if (!this.newPlot.name || this.newPlot.size <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newPlot: FarmPlot = {
      id: Date.now().toString(),
      name: this.newPlot.name,
      size: this.newPlot.size,
      location: this.newPlot.location,
      soilType: this.newPlot.soilType,
      crops: [],
      lastSoilTest: this.newPlot.soilTestDate ? new Date(this.newPlot.soilTestDate) : undefined
    };
    
    this.farmPlots.push(newPlot);
    
    // Reset form
    this.newPlot = {
      name: '',
      size: 0,
      location: '',
      soilType: 'loam',
      soilTestDate: ''
    };
    
    this.calculateAnalytics();
  }

  // Add new crop cycle
  addCrop() {
    if (!this.newCrop.plotId || !this.newCrop.crop || !this.newCrop.plantingDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const plot = this.farmPlots.find(p => p.id === this.newCrop.plotId);
    if (!plot) return;
    
    const newCrop: CropCycle = {
      id: Date.now().toString(),
      crop: this.newCrop.crop,
      variety: this.newCrop.variety,
      plantingDate: new Date(this.newCrop.plantingDate),
      status: 'planted',
      notes: this.newCrop.notes,
      inputs: []
    };
    
    plot.crops.push(newCrop);
    this.cropCycles.push(newCrop);
    
    // Reset form
    this.newCrop = {
      plotId: '',
      crop: '',
      variety: '',
      plantingDate: '',
      notes: ''
    };
    
    this.calculateAnalytics();
  }

  // Add new livestock
  addLivestock() {
    if (!this.newLivestock.type || !this.newLivestock.breed || this.newLivestock.quantity <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newAnimal: Livestock = {
      id: Date.now().toString(),
      type: this.newLivestock.type,
      breed: this.newLivestock.breed,
      quantity: this.newLivestock.quantity,
      age: this.newLivestock.age,
      healthStatus: this.newLivestock.healthStatus
    };
    
    this.livestock.push(newAnimal);
    
    // Reset form
    this.newLivestock = {
      type: '',
      breed: '',
      quantity: 1,
      age: '',
      healthStatus: 'good'
    };
    
    this.calculateAnalytics();
  }

  // Get crop status display
  getCropStatusDisplay(status: string): string {
    switch (status) {
      case 'planted': return 'Planted';
      case 'growing': return 'Growing';
      case 'harvesting': return 'Harvesting';
      case 'harvested': return 'Harvested';
      default: return status;
    }
  }

  // Get crop status color
  getCropStatusColor(status: string): string {
    switch (status) {
      case 'planted': return 'info';
      case 'growing': return 'success';
      case 'harvesting': return 'warning';
      case 'harvested': return 'secondary';
      default: return 'light';
    }
  }

  // Get health status color
  getHealthStatusColor(status: string): string {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'poor': return 'danger';
      default: return 'light';
    }
  }

  // Mark crop as harvested
  markAsHarvested(cropId: string, yieldAmount: number) {
    const crop = this.cropCycles.find(c => c.id === cropId);
    if (crop) {
      crop.status = 'harvested';
      crop.harvestDate = new Date();
      crop.yield = yieldAmount;
      this.calculateAnalytics();
    }
  }

  // Record input application
  recordInput(plotId: string, cropId: string, input: any) {
    const plot = this.farmPlots.find(p => p.id === plotId);
    if (!plot) return;
    
    const crop = plot.crops.find(c => c.id === cropId);
    if (!crop) return;
    
    crop.inputs.push({
      id: Date.now().toString(),
      ...input,
      applicationDate: new Date()
    });
    
    this.calculateAnalytics();
  }

  // Get total farm size
  getTotalFarmSize(): number {
    return this.analytics.totalLand;
  }

  // Get crop distribution
  getCropDistribution(): any[] {
    const distribution: { [key: string]: number } = {};
    
    this.cropCycles.forEach(crop => {
      if (distribution[crop.crop]) {
        distribution[crop.crop]++;
      } else {
        distribution[crop.crop] = 1;
      }
    });
    
    return Object.entries(distribution).map(([crop, count]) => ({ crop, count }));
  }

  // Switch tab
  setActiveTab(tab: 'plots' | 'crops' | 'livestock' | 'analytics') {
    this.activeTab = tab;
  }
}