// categories.component.ts
import { Component, AfterViewInit, OnDestroy, signal, Inject, PLATFORM_ID, OnInit, CUSTOM_ELEMENTS_SCHEMA, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

// Export interfaces so they can be used throughout the component
export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
  current: number;
}

export interface SDG {
  number: string;
  title: string;
  description: string;
}

export interface Slide {
  image: string;
  category: string;
  name: string;
  description: string;
  price: number;
  unit: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  // Impact stats for the new CTA section
  impactStats = signal<ImpactStat[]>([
    { value: 55, suffix: '+', label: 'Tons of Waste Upcycled Monthly', current: 0 },
    { value: 1000, suffix: 'L+', label: 'Liquid Biofertilizer Monthly', current: 0 },
    { value: 5, suffix: 'T+', label: 'Solid Fertilizer Monthly', current: 0 },
    { value: 40, suffix: '%', label: 'Savings on Farm Input Costs', current: 0 },
    { value: 60, suffix: '%', label: 'Increase in Farm Yields', current: 0 }
  ]);

  // SDG data
  sdgs: SDG[] = [
    { number: '1', title: 'No Poverty', description: 'Creating new income streams for farmers, youth, and women through buy-back models and waste-to-value enterprises' },
    { number: '2', title: 'Zero Hunger', description: 'Boosting food security by regenerating soils, increasing yields, and improving crop nutrition through biological and organo-mineral fertilizers' },
    { number: '3', title: 'Gender Equality', description: 'Empowering women in agriculture through training, leadership roles, and economic opportunities' },
    { number: '4', title: 'Responsible Consumption & Production', description: 'Transforming organic waste into high-value fertilizers and creating circular, zero-waste farming systems' },
    { number: '5', title: 'Climate Action', description: 'Reducing emissions, enhancing soil carbon, and building climate-resilient farms through regenerative agriculture' },
    { number: '6', title: 'Life on Land', description: 'Restoring degraded soils, improving biodiversity, and strengthening ecosystem health with microbe-rich inputs' }
  ];

  // Slideshow data
  slides: Slide[] = [
    {
      image: 'images/product2.jpg',
      category: 'Biofertilizer',
      name: 'BioFruity Plus',
      description: 'Balanced liquid nutrition formula that supports flowering & fruit set, improves nutrient uptake & crop quality, and boosts stress tolerance. Ideal for fruiting crops, maize & perennials.',
      price: 400,
      unit: '/half-litre bottle'
    },
    {
      image: 'images/product6.jpg',
      category: 'Biofertilizer',
      name: 'BioVeg Plus',
      description: 'Liquid organic nitrogen booster that drives fast vegetative growth, improves leaf size & greenness, and enhances microbial activity. Ideal for vegetables, cereals & young crops.',
      price: 400,
      unit: '/half-litre bottle'
    },
    {
      image: 'images/vermifrassprod.jpeg',
      category: 'Biofertilizer',
      name: 'VermiFrass Active',
      description: 'Solid organic biofertilizer that restores soil organic matter, improves soil structure & moisture retention, and activates beneficial soil microbes. Ideal for vegetables, cereals & orchards.',
      price: 1500,
      unit: '/25kg bag'
    }
  ];

  currentSlide = 0;
  slideInterval: any;

  private statsAnimated = false;
  private observer: IntersectionObserver | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.startSlideshow();
      }, 0);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Delay observer setup to avoid change detection issues
      setTimeout(() => {
        this.setupIntersectionObserver();
        this.cdr.detectChanges();
      }, 100);
    } else {
      this.setFinalValues();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.stopSlideshow();
  }

  // ========== SLIDESHOW METHODS ==========
  startSlideshow(): void {
    if (isPlatformBrowser(this.platformId) && !this.slideInterval) {
      // Run slideshow outside Angular's zone to prevent change detection issues
      this.ngZone.runOutsideAngular(() => {
        this.slideInterval = setInterval(() => {
          this.ngZone.run(() => {
            this.nextSlide();
          });
        }, 5000);
      });
    }
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextSlide(): void {
    const newIndex = (this.currentSlide + 1) % this.slides.length;
    if (newIndex !== this.currentSlide) {
      this.currentSlide = newIndex;
      this.triggerSlideAnimation();
      this.cdr.detectChanges();
    }
  }

  prevSlide(): void {
    const newIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    if (newIndex !== this.currentSlide) {
      this.currentSlide = newIndex;
      this.triggerSlideAnimation();
      this.cdr.detectChanges();
    }
  }

  goToSlide(index: number): void {
    if (index !== this.currentSlide && index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
      this.triggerSlideAnimation();
      this.resetSlideshowTimer();
      this.cdr.detectChanges();
    }
  }

  private resetSlideshowTimer(): void {
    this.stopSlideshow();
    this.startSlideshow();
  }

  getPrevSlide(): Slide {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    return this.slides[prevIndex];
  }

  getNextSlide(): Slide {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    return this.slides[nextIndex];
  }

  quickView(index: number): void {
    this.currentSlide = index;
    console.log('Quick view for:', this.slides[index].name);
    this.cdr.detectChanges();
  }

  // ========== NAVIGATION METHODS ==========
  navigateToProductsWithScroll(): void {
    this.router.navigate(['/products']).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  // ========== STATS ANIMATION METHODS ==========
  private setupIntersectionObserver(): void {
    const statsElement = document.getElementById('impact-stats');
    
    if (!statsElement) {
      console.warn('Stats element not found, animating immediately');
      this.animateStats();
      return;
    }

    if (this.isElementInViewport(statsElement)) {
      this.animateStats();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats();
            if (this.observer && entry.target) {
              this.observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.observer.observe(statsElement);

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
    
    const duration = 2500;
    
    this.impactStats().forEach((stat, index) => {
      const startTime = Date.now();
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = this.easeOutQuart(progress);
        const currentValue = stat.value * easedProgress;
        
        const newStats = [...this.impactStats()];
        newStats[index].current = currentValue;
        this.impactStats.set(newStats);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          const finalStats = [...this.impactStats()];
          finalStats[index].current = stat.value;
          this.impactStats.set(finalStats);
          this.cdr.detectChanges();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

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
      return Math.floor(stat.current).toFixed(0) + stat.suffix;
    } else {
      return stat.current.toFixed(1) + stat.suffix;
    }
  }

  getImpactStat(index: number): ImpactStat {
    return this.impactStats()[index];
  }

  triggerSlideAnimation(): void {
    if (isPlatformBrowser(this.platformId)) {
      const activeCard = document.querySelector('.active-product-card');
      if (activeCard) {
        activeCard.classList.remove('slide-animation');
        // Force reflow
        void (activeCard as HTMLElement).offsetWidth;
        activeCard.classList.add('slide-animation');
      }
    }
  }
}