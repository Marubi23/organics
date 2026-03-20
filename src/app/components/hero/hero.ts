import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Slide {
  image: string;
  placeholder: string;
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
export class HeroComponent implements AfterViewInit, OnDestroy {
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
  
  private slideInterval: any;
  private progressInterval: any;

  private readonly SLIDE_DURATION = 5000;
  private readonly TRANSITION_DURATION = 600;

  slides: Slide[] = [
    {
      image: 'images/mzuri5.jpg',
      placeholder: 'images/placeholders/mzuri5-small.jpg',
      title: 'Regenerating Kenyan Soil Health',
      description: 'Building smallholder farmers\' resilience to climate change through regenerative agricultural practices across Kenya.',
      buttonText: 'Our Biofertilizers',
      buttonLink: '/products',
      loaded: false
    },
    {
      image: 'images/mzuri8.jpg',
      placeholder: 'images/placeholders/mzuri8-small.jpg',
      title: 'Organic Waste to Nutrient-Rich Fertilizers',
      description: 'Transforming farm and market waste into premium organic fertilizers using Black Soldier Fly Larvae technology.',
      buttonText: 'Our Process',
      buttonLink: '/what-we-do',
      loaded: false
    },
    {
      image: 'images/mzuri7.jpg',
      placeholder: 'images/placeholders/mzuri7-small.jpg',
      title: 'Circular Economy in Action',
      description: 'See how we convert organic waste into valuable resources while creating sustainable livelihoods for Kenyan farmers.',
      buttonText: 'Watch Our Story',
      buttonLink: '/about',
      isVideoSlide: true,
      loaded: false
    },
    {
      image: 'images/mzuri6.jpg',
      placeholder: 'images/placeholders/mzuri6-small.jpg',
      title: 'High-Protein Animal Feed Solutions',
      description: 'Insect-based protein feeds containing up to 50% protein - perfect for poultry, fish, and livestock farming.',
      buttonText: 'Animal Feeds',
      buttonLink: '/products/feeds',
      loaded: false
    },
    {
      image: 'images/mzuripic2.jpg',
      placeholder: 'images/placeholders/mzuripic2-small.jpg',
      title: 'Empowering Smallholder Farmers',
      description: 'Training programs in regenerative agriculture, vermicomposting, and market access for sustainable livelihoods.',
      buttonText: 'Join Regen-Kilimo',
      buttonLink: '/regen-kilimo',
      loaded: false
    },
    {
      image: 'images/mzuri4.jpg',
      placeholder: 'images/placeholders/mzuri4-small.jpg',
      title: 'Precision Farming Technology',
      description: 'Data-driven precision dosing to optimize fertilizer use and maximize yields for Kenyan farmers.',
      buttonText: 'PREFarm Initiative',
      buttonLink: '/prefarm',
      loaded: false
    }
  ];

  ngOnInit() {
    this.preloadFirstSlide();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.isLoading) {
        this.startAutoSlide();
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.stopProgressBar();
    this.closeMiniVideo();
  }

  preloadFirstSlide() {
    const img = new Image();
    img.src = this.slides[0].image;
    img.onload = () => {
      this.slides[0].loaded = true;
      this.imagesLoaded++;
      this.checkAllImagesLoaded();
    };
  }

  onImageLoad(index: number) {
    this.slides[index].loaded = true;
    this.imagesLoaded++;
    this.checkAllImagesLoaded();
  }

  checkAllImagesLoaded() {
    if (this.imagesLoaded >= 2) {
      this.isLoading = false;
      this.cdr.detectChanges();
      
      if (!this.isUserInteracting) {
        setTimeout(() => {
          this.startAutoSlide();
        }, 500);
      }
    }
  }

  startAutoSlide() {
    if (this.isLoading) return;
    
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
        this.progressBarWidth += 0.5;
        this.cdr.detectChanges();
      }
    }, this.SLIDE_DURATION / 200);
  }

  stopProgressBar() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressBarWidth = 0;
    }
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
      
    }, this.TRANSITION_DURATION);
  }

  prevSlide() {
    if (this.isAnimating || this.isLoading) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.nextSlideIndex = prevIndex;
    
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
      
    }, this.TRANSITION_DURATION);
  }

  goToSlide(index: number) {
    if (index === this.currentSlide || this.isAnimating || this.isLoading) return;
    
    this.isAnimating = true;
    this.stopAutoSlide();
    
    this.nextSlideIndex = index;
    
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
      
    }, this.TRANSITION_DURATION);
  }

  resetAutoSlide() {
    if (this.isLoading) return;
    
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