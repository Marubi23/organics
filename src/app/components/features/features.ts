// features.component.ts
import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
  badge: string;
  badgeType: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './features.html',
  styleUrls: ['./features.css']
})
export class FeaturesComponent implements OnInit, AfterViewInit {
  features: Feature[] = [
    {
      icon: 'delivery',
      title: 'Free Delivery',
      description: 'Free delivery on orders over KSh 2,000 within Nairobi and major towns',
      badge: 'Most Popular',
      badgeType: 'popular'
    },
    {
      icon: 'organic',
      title: '100% Organic Certified',
      description: 'Certified organic produce from trusted local farmers with full traceability',
      badge: 'Certified',
      badgeType: 'certified'
    },
    {
      icon: 'guarantee',
      title: 'Freshness Guaranteed',
      description: 'Farm-fresh quality guaranteed or your money back - no questions asked',
      badge: 'Guarantee',
      badgeType: 'guarantee'
    },
    {
      icon: 'support',
      title: 'Direct Farmer Support',
      description: 'Your purchase directly supports local farming communities and sustainable agriculture',
      badge: 'Community Impact',
      badgeType: 'impact'
    }
  ];

  stats = [
    { value: 5000, label: 'Happy Customers' },
    { value: 150, label: 'Local Farmers' },
    { value: 98, label: 'Satisfaction Rate' },
    { value: 24, label: 'Delivery Hours' }
  ];

  private animatedStats = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  private initAnimations(): void {
    // Initialize counter animation for stats
    this.animateStats();
  }

  private animateStats(): void {
    if (this.animatedStats) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedStats) {
          this.animatedStats = true;
          this.startCountingAnimation();
        }
      });
    }, { threshold: 0.5 }); // Increased threshold for better detection

    const statsElement = document.querySelector('.features-stats');
    if (statsElement) {
      observer.observe(statsElement);
    } else {
      console.warn('Stats element not found');
    }
  }

  private startCountingAnimation(): void {
    const statElements = document.querySelectorAll('.stat-number');
    
    statElements.forEach((statElement, index) => {
      const targetValue = this.stats[index].value;
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(targetValue * progress);
        
        if (statElement) {
          statElement.textContent = currentValue.toString();
        }
        
        if (frame === totalFrames) {
          clearInterval(counter);
          // Add plus sign for all except the last one
          if (index !== 3 && statElement) {
            statElement.textContent = targetValue.toString() + '+';
          }
        }
      }, frameDuration);
    });
  }

  // Method to handle feature card clicks
  onFeatureClick(feature: Feature): void {
    console.log('Feature clicked:', feature.title);
    // You can add navigation or modal opening logic here
  }

  // Method to get feature icon based on type
  getFeatureIcon(iconType: string): string {
    const icons = {
      delivery: '🚚',
      organic: '🌱',
      guarantee: '💚',
      support: '🤝'
    };
    return icons[iconType as keyof typeof icons] || '⭐';
  }
}