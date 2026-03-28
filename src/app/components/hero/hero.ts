import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isVideoSlide?: boolean;
  loaded?: boolean;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  
  @ViewChild('miniVideo') miniVideoRef!: ElementRef<HTMLVideoElement>;
  
  currentSlide = 0;
  nextSlideIndex = 1;
  transformValue = 'translateX(0%)';
  isAnimating = false;
  isUserInteracting = false;
  progressBarWidth = 0;
  showMiniVideo = false;
  isVideoPlaying = false;
  isVideoMuted = true;
  isLoading = true;
  imagesLoaded = 0;
  private forceShowTimeout: any;
  
  private slideInterval: any;
  private progressInterval: any;

  private readonly SLIDE_DURATION = 5000;
  private readonly TRANSITION_DURATION = 600;
  private readonly MAX_LOADING_TIME = 800; // Max 800ms before showing content

  slides: Slide[] = [
    {
      image: 'images/mzuri5.jpg',
      title: 'Regenerating Kenyan Soil Health',
      description: 'Building smallholder farmers\' resilience to climate change through regenerative agricultural practices across Kenya.',
      buttonText: 'Our Biofertilizers',
      buttonLink: '/products',
      loaded: false
    },
    {
      image: 'images/mzuri8.jpg',
      title: 'Organic Waste to Nutrient-Rich Fertilizers',
      description: 'Transforming farm and market waste into premium organic fertilizers using Black Soldier Fly Larvae technology.',
      buttonText: 'Our Process',
      buttonLink: '/what-we-do',
      loaded: false
    },
    {
      image: 'images/mzuri7.jpg',
      title: 'Circular Economy in Action',
      description: 'See how we convert organic waste into valuable resources while creating sustainable livelihoods for Kenyan farmers.',
      buttonText: 'Watch Our Story',
      buttonLink: '/about',
      isVideoSlide: true,
      loaded: false
    },
    {
      image: 'images/mzuri6.jpg',
      title: 'High-Protein Animal Feed Solutions',
      description: 'Insect-based protein feeds containing up to 50% protein - perfect for poultry, fish, and livestock farming.',
      buttonText: 'Animal Feeds',
      buttonLink: '/products/feeds',
      loaded: false
    },
    {
      image: 'images/mzuripic2.jpg',
      title: 'Empowering Smallholder Farmers',
      description: 'Training programs in regenerative agriculture, vermicomposting, and market access for sustainable livelihoods.',
      buttonText: 'Join Regen-Kilimo',
      buttonLink: '/regen-kilimo',
      loaded: false
    },
    {
      image: 'images/mzuri4.jpg',
      title: 'Precision Farming Technology',
      description: 'Data-driven precision dosing to optimize fertilizer use and maximize yields for Kenyan farmers.',
      buttonText: 'PREFarm Initiative',
      buttonLink: '/prefarm',
      loaded: false
    }
  ];

  ngOnInit() {
    // Start preloading all images immediately
    this.preloadAllImages();
    
    // Force show content after MAX_LOADING_TIME to prevent indefinite loading
    this.forceShowTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.log('Force showing content after timeout');
        this.forceShowContent();
      }
    }, this.MAX_LOADING_TIME);
  }

  ngAfterViewInit() {
    // Additional safety: if still loading after 1 second, force show
    setTimeout(() => {
      if (this.isLoading) {
        this.forceShowContent();
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.stopProgressBar();
    this.closeMiniVideo();
    if (this.forceShowTimeout) {
      clearTimeout(this.forceShowTimeout);
    }
  }

  preloadAllImages() {
    // Load all images in parallel for faster loading
    this.slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        slide.loaded = true;
        this.imagesLoaded++;
        this.checkAllImagesLoaded();
      };
      img.onerror = () => {
        // Even if image fails to load, mark as loaded to show content
        console.warn(`Failed to load image: ${slide.image}`);
        slide.loaded = true;
        this.imagesLoaded++;
        this.checkAllImagesLoaded();
      };
    });
  }

  onImageLoad(index: number) {
    this.slides[index].loaded = true;
    this.imagesLoaded++;
    this.checkAllImagesLoaded();
    this.cdr.detectChanges();
  }

  onImageError(index: number) {
    console.warn(`Image failed to load: ${this.slides[index].image}`);
    this.slides[index].loaded = true;
    this.imagesLoaded++;
    this.checkAllImagesLoaded();
    this.cdr.detectChanges();
  }

  checkAllImagesLoaded() {
    // Show content after at least 2 images load OR after 50% of images load
    const minImagesToShow = Math.min(2, this.slides.length);
    if (this.imagesLoaded >= minImagesToShow || this.imagesLoaded === this.slides.length) {
      this.hideLoadingSkeleton();
    }
  }

  forceShowContent() {
    if (!this.isLoading) return;
    
    this.isLoading = false;
    // Ensure first slide is marked as loaded
    if (!this.slides[0].loaded) {
      this.slides[0].loaded = true;
    }
    this.cdr.detectChanges();
    
    // Start auto-slide immediately
    if (!this.isUserInteracting) {
      setTimeout(() => {
        this.startAutoSlide();
      }, 100);
    }
  }

  hideLoadingSkeleton() {
    if (!this.isLoading) return;
    
    this.isLoading = false;
    this.cdr.detectChanges();
    
    // Start auto-slide after a short delay
    if (!this.isUserInteracting) {
      setTimeout(() => {
        this.startAutoSlide();
      }, 300);
    }
  }

  startAutoSlide() {
    if (this.isLoading) return;
    
    this.stopAutoSlide(); // Clear any existing intervals
    this.startProgressBar();
    
    this.slideInterval = setTimeout(() => {
      this.nextSlide();
    }, this.SLIDE_DURATION);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearTimeout(this.slideInterval);
      this.slideInterval = null;
    }
    this.stopProgressBar();
  }

  startProgressBar() {
    this.progressBarWidth = 0;
    this.stopProgressBar(); // Clear any existing progress interval
    
    this.progressInterval = setInterval(() => {
      if (this.progressBarWidth < 100 && !this.isUserInteracting && !this.isLoading) {
        this.progressBarWidth += 0.5;
        this.cdr.detectChanges();
      } else if (this.progressBarWidth >= 100) {
        this.stopProgressBar();
      }
    }, this.SLIDE_DURATION / 200);
  }

  stopProgressBar() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.progressBarWidth = 0;
  }

  navigateToBiofertilizers(): void {
    this.router.navigate(['/products'], { fragment: 'products-display' }).then(() => {
      setTimeout(() => {
        this.scrollToProductsSection();
      }, 500);
    });
  }

  private scrollToProductsSection(): void {
    const productsSection = document.getElementById('products-display');
    if (productsSection) {
      const offset = 100;
      const elementPosition = productsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  updateTransform() {
    this.transformValue = `translateX(-${this.currentSlide * 100}%)`;
    this.cdr.detectChanges();
  }

  nextSlide() {
    if (this.isAnimating || this.isLoading) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.nextSlideIndex = nextIndex;
    
    // Preload next image if not loaded
    if (!this.slides[nextIndex].loaded) {
      const img = new Image();
      img.src = this.slides[nextIndex].image;
    }
    
    setTimeout(() => {
      this.currentSlide = nextIndex;
      this.updateTransform();
      
      setTimeout(() => {
        this.isAnimating = false;
        
        if (!this.isUserInteracting && !this.isLoading) {
          this.startAutoSlide();
        }
      }, this.TRANSITION_DURATION);
      
    }, 50);
  }

  prevSlide() {
    if (this.isAnimating || this.isLoading) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.nextSlideIndex = prevIndex;
    
    // Preload previous image if not loaded
    if (!this.slides[prevIndex].loaded) {
      const img = new Image();
      img.src = this.slides[prevIndex].image;
    }
    
    setTimeout(() => {
      this.currentSlide = prevIndex;
      this.updateTransform();
      
      setTimeout(() => {
        this.isAnimating = false;
        
        if (!this.isUserInteracting && !this.isLoading) {
          this.startAutoSlide();
        }
      }, this.TRANSITION_DURATION);
      
    }, 50);
  }

  goToSlide(index: number) {
    if (index === this.currentSlide || this.isAnimating || this.isLoading) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    this.nextSlideIndex = index;
    
    // Preload target image if not loaded
    if (!this.slides[index].loaded) {
      const img = new Image();
      img.src = this.slides[index].image;
    }
    
    setTimeout(() => {
      this.currentSlide = index;
      this.updateTransform();
      
      setTimeout(() => {
        this.isAnimating = false;
        
        if (!this.isUserInteracting && !this.isLoading) {
          this.startAutoSlide();
        }
      }, this.TRANSITION_DURATION);
      
    }, 50);
  }

  resetAutoSlide() {
    if (this.isLoading) return;
    
    this.isUserInteracting = true;
    this.stopAutoSlide();
    this.stopProgressBar();
    
    setTimeout(() => {
      this.isUserInteracting = false;
      if (!this.isLoading) {
        this.startAutoSlide();
      }
    }, 8000);
  }

  onUserInteraction() {
    this.resetAutoSlide();
  }

  playMiniVideo() {
    this.showMiniVideo = true;
    this.isUserInteracting = true;
    this.stopAutoSlide();
    
    setTimeout(() => {
      if (this.miniVideoRef) {
        const video = this.miniVideoRef.nativeElement;
        video.muted = this.isVideoMuted;
        video.play()
          .then(() => {
            this.isVideoPlaying = true;
            this.cdr.detectChanges();
          })
          .catch((error: any) => {
            console.error('Video playback failed:', error);
          });
      }
    }, 100);
  }

  closeMiniVideo() {
    if (this.miniVideoRef) {
      const video = this.miniVideoRef.nativeElement;
      video.pause();
      video.currentTime = 0;
    }
    
    this.showMiniVideo = false;
    this.isVideoPlaying = false;
    this.resetAutoSlide();
  }

  togglePlayPause() {
    if (this.miniVideoRef) {
      const video = this.miniVideoRef.nativeElement;
      if (video.paused) {
        video.play();
        this.isVideoPlaying = true;
      } else {
        video.pause();
        this.isVideoPlaying = false;
      }
      this.cdr.detectChanges();
    }
  }

  toggleMute() {
    if (this.miniVideoRef) {
      const video = this.miniVideoRef.nativeElement;
      video.muted = !video.muted;
      this.isVideoMuted = video.muted;
      this.cdr.detectChanges();
    }
  }

  toggleFullscreen() {
    if (this.miniVideoRef) {
      const video = this.miniVideoRef.nativeElement;
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch((err: any) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  }
}