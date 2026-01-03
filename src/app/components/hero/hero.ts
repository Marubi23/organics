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
  animation?: string; // Add animation type for each slide
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
  animationClass = ''; // Animation class for transition
  private slideInterval: any;
  private isUserInteracting = false;
  private animationTimeout: any;

  // Animation types for transitions
  private animations = [
    'broken-glass',
    'zoom-reveal',
    'swirl',
    'cube-rotate',
    'page-flip',
    'blinds',
    'mosaic',
    'particles'
  ];

  slides: Slide[] = [
    {
      image: 'images/mzurislide2.JPG',
      title: 'Regenerating Kenyan Soil Health',
      description: 'Building smallholder farmers\' resilience to climate change through regenerative agricultural practices across Kenya.',
      buttonText: 'Our Biofertilizers',
      buttonLink: '/products',
      animation: 'broken-glass'
    },
    {
      image: 'images/mzurilastslide.JPG',
      title: 'Organic Waste to Nutrient-Rich Fertilizers',
      description: 'Transforming farm and market waste into premium organic fertilizers using Black Soldier Fly Larvae technology.',
      buttonText: 'Our Process',
      buttonLink: '/bioconversion',
      animation: 'zoom-reveal'
    },
    {
      image: 'videos/agricvid.webm',
      title: 'Circular Economy in Action',
      description: 'See how we convert organic waste into valuable resources while creating sustainable livelihoods for Kenyan farmers.',
      buttonText: 'Watch Our Story',
      buttonLink: '/about',
      isVideo: true,
      animation: 'swirl'
    },
    {
      image: 'images/mzurislide3.JPG',
      title: 'High-Protein Animal Feed Solutions',
      description: 'Insect-based protein feeds containing up to 50% protein - perfect for poultry, fish, and livestock farming.',
      buttonText: 'Animal Feeds',
      buttonLink: '/products/feeds',
      animation: 'cube-rotate'
    },
    {
      image: 'images/mzurislide4.JPG',
      title: 'Empowering Smallholder Farmers',
      description: 'Training programs in regenerative agriculture, vermicomposting, and market access for sustainable livelihoods.',
      buttonText: 'Join Regen-Kilimo',
      buttonLink: '/regen-kilimo',
      animation: 'page-flip'
    },
    {
      image: 'images/mzurislide5.JPG',
      title: 'Precision Farming Technology',
      description: 'Data-driven precision dosing to optimize fertilizer use and maximize yields for Kenyan farmers.',
      buttonText: 'PREFarm Initiative',
      buttonLink: '/prefarm',
      animation: 'blinds'
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
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      if (!this.isUserInteracting) {
        this.nextSlide();
      }
    }, 5000); // Increased to 5 seconds for animations
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
    this.triggerAnimation();
    
    this.animationTimeout = setTimeout(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.updateTransform();
      this.resetAutoSlide();
    }, 800); // Match animation duration
  }

  prevSlide() {
    this.triggerAnimation();
    
    this.animationTimeout = setTimeout(() => {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.updateTransform();
      this.resetAutoSlide();
    }, 800);
  }

  goToSlide(index: number) {
    if (index !== this.currentSlide) {
      this.triggerAnimation();
      
      this.animationTimeout = setTimeout(() => {
        this.currentSlide = index;
        this.updateTransform();
        this.resetAutoSlide();
      }, 800);
    }
  }

  private triggerAnimation() {
    // Set random animation or use slide's specific animation
    const animationIndex = Math.floor(Math.random() * this.animations.length);
    this.animationClass = this.animations[animationIndex];
    
    // Clear animation after it completes
    setTimeout(() => {
      this.animationClass = '';
    }, 1000);
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