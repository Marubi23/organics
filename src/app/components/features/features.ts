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



  stats = [
    { value: 100, label: 'Happy Customers', target: 8000 },
    { value: 1, label: 'Organic Products', target: 5 },
    { value: 10, label: 'Farm Partners', target: 100 },
    { value: 1, label: 'Years Experience', target: 5 }
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