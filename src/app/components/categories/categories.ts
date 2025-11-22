// categories.component.ts
import { Component, AfterViewInit, OnDestroy, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
  current: number;
}

interface SDG {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements AfterViewInit, OnDestroy {
  // Impact stats for the new CTA section
  impactStats = signal<ImpactStat[]>([
    { value: 5, suffix: '+', label: 'Tons of Waste Upcycled Monthly', current: 0 },
    { value: 1000, suffix: 'L', label: 'Liquid Biofertilizer Weekly', current: 0 },
    { value: 1.5, suffix: 'T', label: 'Solid Fertilizer Monthly', current: 0 },
    { value: 60, suffix: '%', label: 'Farmer Input Savings', current: 0 }
  ]);

  // SDG data
  sdgs: SDG[] = [
    { number: '1', title: 'No Poverty', description: 'Building farmer resilience and economic stability' },
    { number: '2', title: 'Zero Hunger', description: 'Sustainable food production systems' },
    { number: '5', title: 'Gender Equality', description: 'Empowering women in agriculture' },
    { number: '8', title: 'Decent Work', description: 'Creating sustainable employment' },
    { number: '12', title: 'Responsible Consumption', description: 'Circular economy practices' },
    { number: '13', title: 'Climate Action', description: 'Climate-resilient agriculture' },
    { number: '15', title: 'Life on Land', description: 'Ecosystem restoration' }
  ];

  private statsAnimated = false;
  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Give Angular time to render the component
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 300);
    } else {
      // Server-side: show final values
      this.setFinalValues();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const statsElement = document.getElementById('impact-stats');
    
    if (!statsElement) {
      console.warn('Stats element not found, animating immediately');
      this.animateStats();
      return;
    }

    // Check if already in viewport
    if (this.isElementInViewport(statsElement)) {
      this.animateStats();
      return;
    }

    // Set up IntersectionObserver with more sensitive settings
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats();
            // Stop observing after animation starts
            if (this.observer && entry.target) {
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% is visible
        rootMargin: '0px 0px -10% 0px' // Trigger when element is 10% from bottom of viewport
      }
    );

    this.observer.observe(statsElement);

    // Fallback: animate after 3 seconds if IntersectionObserver doesn't trigger
    setTimeout(() => {
      if (!this.statsAnimated) {
        console.log('Fallback: animating stats after timeout');
        this.statsAnimated = true;
        this.animateStats();
      }
    }, 3000);
  }

  private isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private animateStats(): void {
    console.log('Starting stats animation');
    
    const duration = 2500; // 2.5 seconds
    const steps = 120; // More steps for smoother animation
    
    this.impactStats().forEach((stat, index) => {
      let step = 0;
      const startTime = Date.now();
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing for smooth animation
        const easedProgress = this.easeOutQuart(progress);
        const currentValue = stat.value * easedProgress;
        
        const newStats = [...this.impactStats()];
        newStats[index].current = currentValue;
        this.impactStats.set(newStats);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final value is exact
          const finalStats = [...this.impactStats()];
          finalStats[index].current = stat.value;
          this.impactStats.set(finalStats);
        }
      };
      
      // Start animation
      requestAnimationFrame(animate);
    });
  }

  // Smooth easing function
  private easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  private setFinalValues(): void {
    const finalStats = this.impactStats().map(stat => ({
      ...stat,
      current: stat.value
    }));
    this.impactStats.set(finalStats);
  }

  formatStatValue(stat: ImpactStat): string {
    if (stat.value % 1 === 0) {
      // For whole numbers
      return Math.floor(stat.current).toFixed(0) + stat.suffix;
    } else {
      // For decimal numbers
      return stat.current.toFixed(1) + stat.suffix;
    }
  }
}