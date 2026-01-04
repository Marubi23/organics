import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
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
  nextSlideIndex = 1;
  transformValue = 'translateX(0%)';
  isAnimating = false;
  isUserInteracting = false;
  progressBarWidth = 0;
  
  private slideInterval: any;
  private progressInterval: any;
  private loadedImages: Set<number> = new Set();
  private preloadedNextImage = false;

  // Slide duration in milliseconds
  private readonly SLIDE_DURATION = 5000;
  private readonly TRANSITION_DURATION = 600;

  slides: Slide[] = [
    {
      image: 'images/mzurislide2.JPG',
      title: 'Regenerating Kenyan Soil Health',
      description: 'Building smallholder farmers\' resilience to climate change through regenerative agricultural practices across Kenya.',
      buttonText: 'Our Biofertilizers',
      buttonLink: '/products'
    },
    {
      image: 'images/mzurilastslide.JPG',
      title: 'Organic Waste to Nutrient-Rich Fertilizers',
      description: 'Transforming farm and market waste into premium organic fertilizers using Black Soldier Fly Larvae technology.',
      buttonText: 'Our Process',
      buttonLink: '/bioconversion'
    },
    {
      image: 'images/slidevideo.JPG',
      title: 'Circular Economy in Action',
      description: 'See how we convert organic waste into valuable resources while creating sustainable livelihoods for Kenyan farmers.',
      buttonText: 'Watch Our Story',
      buttonLink: '/about'
    },
    {
      image: 'images/mzurislide3.JPG',
      title: 'High-Protein Animal Feed Solutions',
      description: 'Insect-based protein feeds containing up to 50% protein - perfect for poultry, fish, and livestock farming.',
      buttonText: 'Animal Feeds',
      buttonLink: '/products/feeds'
    },
    {
      image: 'images/mzurislide4.JPG',
      title: 'Empowering Smallholder Farmers',
      description: 'Training programs in regenerative agriculture, vermicomposting, and market access for sustainable livelihoods.',
      buttonText: 'Join Regen-Kilimo',
      buttonLink: '/regen-kilimo'
    },
    {
      image: 'images/mzurislide5.JPG',
      title: 'Precision Farming Technology',
      description: 'Data-driven precision dosing to optimize fertilizer use and maximize yields for Kenyan farmers.',
      buttonText: 'PREFarm Initiative',
      buttonLink: '/prefarm'
    }
  ];

  ngAfterViewInit() {
    // Preload all images
    this.preloadAllImages();
    
    // Start with first slide visible
    this.loadedImages.add(0);
    
    // Start auto-slide after a short delay
    setTimeout(() => {
      this.startAutoSlide();
    }, 300);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.stopProgressBar();
  }

  private preloadAllImages(): void {
    this.slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        this.loadedImages.add(index);
        console.log(`Image ${index} preloaded`);
      };
      img.onerror = () => {
        console.warn(`Failed to load image ${index}: ${slide.image}`);
      };
    });
  }

  private preloadNextImage(): void {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    
    if (!this.loadedImages.has(nextIndex)) {
      const img = new Image();
      img.src = this.slides[nextIndex].image;
      img.onload = () => {
        this.loadedImages.add(nextIndex);
        this.preloadedNextImage = true;
        console.log(`Next image ${nextIndex} preloaded`);
      };
    } else {
      this.preloadedNextImage = true;
    }
  }

  startAutoSlide() {
    this.startProgressBar();
    
    this.slideInterval = setTimeout(() => {
      this.nextSlide();
    }, this.SLIDE_DURATION);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearTimeout(this.slideInterval);
    }
    this.stopProgressBar();
  }

  startProgressBar() {
    this.progressBarWidth = 0;
    
    this.progressInterval = setInterval(() => {
      if (this.progressBarWidth < 100) {
        this.progressBarWidth += 0.5; // Adjust speed as needed
        this.cdr.detectChanges();
      }
    }, this.SLIDE_DURATION / 200); // Divide by 200 for smooth progress
  }

  stopProgressBar() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressBarWidth = 0;
    }
  }

  updateTransform() {
    this.transformValue = `translateX(-${this.currentSlide * 100}%)`;
    this.cdr.detectChanges();
  }

  nextSlide() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.nextSlideIndex = nextIndex;
    
    // Start preloading the next-next image for smoother experience
    const nextNextIndex = (nextIndex + 1) % this.slides.length;
    if (!this.loadedImages.has(nextNextIndex)) {
      const img = new Image();
      img.src = this.slides[nextNextIndex].image;
    }
    
    // Smooth transition
    setTimeout(() => {
      this.currentSlide = nextIndex;
      this.updateTransform();
      
      // Reset animation state
      setTimeout(() => {
        this.isAnimating = false;
        this.preloadedNextImage = false;
        
        // Restart auto slide if not interacting
        if (!this.isUserInteracting) {
          this.startAutoSlide();
        }
      }, this.TRANSITION_DURATION);
      
    }, this.TRANSITION_DURATION);
  }

  prevSlide() {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.nextSlideIndex = prevIndex;
    
    setTimeout(() => {
      this.currentSlide = prevIndex;
      this.updateTransform();
      
      setTimeout(() => {
        this.isAnimating = false;
        
        if (!this.isUserInteracting) {
          this.startAutoSlide();
        }
      }, this.TRANSITION_DURATION);
      
    }, this.TRANSITION_DURATION);
  }

  goToSlide(index: number) {
    if (index === this.currentSlide || this.isAnimating) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    this.nextSlideIndex = index;
    
    setTimeout(() => {
      this.currentSlide = index;
      this.updateTransform();
      
      setTimeout(() => {
        this.isAnimating = false;
        
        if (!this.isUserInteracting) {
          this.startAutoSlide();
        }
      }, this.TRANSITION_DURATION);
      
    }, this.TRANSITION_DURATION);
  }

  resetAutoSlide() {
    this.isUserInteracting = true;
    this.stopAutoSlide();
    
    setTimeout(() => {
      this.isUserInteracting = false;
      this.startAutoSlide();
    }, 8000);
  }

  onUserInteraction() {
    this.resetAutoSlide();
  }

  onImageLoad(index: number) {
    this.loadedImages.add(index);
    console.log(`Image ${index} loaded successfully`);
    
    // If this is the next slide, mark it as ready
    if (index === this.nextSlideIndex) {
      this.preloadedNextImage = true;
    }
  }
}