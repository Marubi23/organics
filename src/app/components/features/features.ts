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
    
    // Initialize intersection observer for scroll animations
    this.initScrollAnimations();
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
    });

    const statsElement = document.querySelector('.features-stats');
    if (statsElement) {
      observer.observe(statsElement);
    }
  }

  private startCountingAnimation(): void {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((statElement, index) => {
      const targetValue = this.stats[index].value;
      const duration = 2000;
      const steps = 60;
      const increment = targetValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          statElement.textContent = targetValue.toString();
          clearInterval(timer);
        } else {
          statElement.textContent = Math.floor(current).toString();
        }
      }, duration / steps);
    });
  }

  private initScrollAnimations(): void {
    // This would typically use a library like AOS (Animate On Scroll)
    // For now, we'll use a simple intersection observer
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
      observer.observe(card);
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