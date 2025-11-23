// features.component.ts
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrls: ['./features.css']
})
export class FeaturesComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  features = [
    {
      title: 'Free Delivery',
      description: 'Enjoy free delivery on all orders over $50, straight to your doorstep.',
      badge: 'FREE'
    },
    {
      title: '100% Organic',
      description: 'All our products are certified organic with no harmful chemicals or pesticides.',
      badge: 'CERTIFIED'
    },
    {
      title: 'Fresh Guarantee',
      description: 'We guarantee the freshness of all our products with our farm-to-table process.',
      badge: 'GUARANTEED'
    },
    {
      title: 'Support Farmers',
      description: 'Your purchase directly supports local farmers and sustainable agriculture.',
      badge: 'IMPACT'
    }
  ];

  stats = [
    { value: 100, label: 'Happy Customers', target: 10000 },
    { value: 3000, label: 'Organic Products', target: 5000 },
    { value: 7000, label: 'Farm Partners', target: 10000 },
    { value: 10, label: 'Years Experience', target: 20 }
  ];

  ngAfterViewInit() {
    // Use setTimeout to ensure this runs after the current change detection cycle
    setTimeout(() => {
      this.animateStats();
    });
  }

  onFeatureClick(feature: any) {
    console.log('Feature clicked:', feature);
  }

  animateStats() {
    console.log('Starting stats animation');
    
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    this.stats.forEach(stat => {
      const startValue = stat.value;
      const targetValue = stat.target;
      const increment = (targetValue - startValue) / steps;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        stat.value = Math.round(startValue + (increment * currentStep));
        
        // Manually trigger change detection
        this.cdr.detectChanges();
        
        if (currentStep >= steps) {
          stat.value = targetValue;
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }
}