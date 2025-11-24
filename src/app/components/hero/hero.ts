import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isVideo?: boolean;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  
  currentSlide = 0;
  transformValue = 'translateX(0%)';
  private slideInterval: any;
  private isUserInteracting = false;

  slides: Slide[] = [
    {
      image: 'images/greens1.jpg',
      title: 'Regenerating Kenyan Soil Health',
      description: 'Building smallholder farmers\' resilience to climate change through regenerative agricultural practices across Kenya.',
      buttonText: 'Our Biofertilizers',
      buttonLink: '/products'
    },
    {
      image: 'images/greens2.jpg',
      title: 'Organic Waste to Nutrient-Rich Fertilizers',
      description: 'Transforming farm and market waste into premium organic fertilizers using Black Soldier Fly Larvae technology.',
      buttonText: 'Our Process',
      buttonLink: '/bioconversion'
    },
    {
      image: 'videos/agricvid.webm',
      title: 'Circular Economy in Action',
      description: 'See how we convert organic waste into valuable resources while creating sustainable livelihoods for Kenyan farmers.',
      buttonText: 'Watch Our Story',
      buttonLink: '/about',
      isVideo: true
    },
    {
      image: 'images/greens3.jpg',
      title: 'High-Protein Animal Feed Solutions',
      description: 'Insect-based protein feeds containing up to 50% protein - perfect for poultry, fish, and livestock farming.',
      buttonText: 'Animal Feeds',
      buttonLink: '/products/feeds'
    },
    {
      image: 'images/greens4.jpg',
      title: 'Empowering Smallholder Farmers',
      description: 'Training programs in regenerative agriculture, vermicomposting, and market access for sustainable livelihoods.',
      buttonText: 'Join Regen-Kilimo',
      buttonLink: '/regen-kilimo'
    },
    {
      image: 'images/greens5.jpg',
      title: 'Precision Farming Technology',
      description: 'Data-driven precision dosing to optimize fertilizer use and maximize yields for Kenyan farmers.',
      buttonText: 'PREFarm Initiative',
      buttonLink: '/prefarm'
    }
  ];

  ngAfterViewInit() {
    // Start auto-slide after the view is initialized
    setTimeout(() => {
      this.startAutoSlide();
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      if (!this.isUserInteracting) {
        this.nextSlide();
      }
    }, 3000);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  updateTransform() {
    this.transformValue = `translateX(-${this.currentSlide * 100}%)`;
    this.cdr.detectChanges();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateTransform();
    this.resetAutoSlide();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateTransform();
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateTransform();
    this.resetAutoSlide();
  }

  private resetAutoSlide() {
    this.isUserInteracting = true;
    this.stopAutoSlide();
    
    setTimeout(() => {
      this.isUserInteracting = false;
      this.startAutoSlide();
    }, 10000);
  }

  // Handle user interaction
  onUserInteraction() {
    this.resetAutoSlide();
  }

  // Video event handlers
  onVideoPlay() {
    this.stopAutoSlide();
  }

  onVideoPause() {
    this.startAutoSlide();
  }

  onVideoEnded() {
    this.nextSlide();
  }
}