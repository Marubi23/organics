// features.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrls: ['./features.css']
})
export class FeaturesComponent implements OnInit {
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

  ngOnInit() {
    this.animateStats();
  }

  onFeatureClick(feature: any) {
    // Handle feature click - could open modal or navigate
    console.log('Feature clicked:', feature);
  }

  animateStats() {
    const duration = 2000; // Animation duration in ms
    const steps = 60; // Number of animation steps
    const stepDuration = duration / steps;
    
    this.stats.forEach(stat => {
      let currentStep = 0;
      const increment = stat.target / steps;
      
      const timer = setInterval(() => {
        currentStep++;
        stat.value = Math.round(increment * currentStep);
        
        if (currentStep >= steps) {
          stat.value = stat.target;
          clearInterval(timer);
        }
      }, stepDuration);
    });
  }
}