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
      title: 'Championing Regenerative Agriculture',
      description: 'Our mission is to build smallholder farmers\' resilience to climate change through regenerative practices.',
      buttonText: 'Shop Fresh Produce',
      buttonLink: '/shop'
    },
    {
      image: 'images/greens2.jpg',
      title: 'Sustainable Farming Solutions',
      description: 'Transforming agriculture with eco-friendly practices that benefit farmers and the environment.',
      buttonText: 'Our Products',
      buttonLink: '/products'
    },
    {
      image: 'https://drive.google.com/uc?export=download&id=1R0XrzGiPAtBcfGYPnIJZPFmiEVfOXXEa',
      title: 'Transforming Agriculture',
      description: 'Watch how we\'re revolutionizing farming with sustainable methods and community empowerment.',
      buttonText: 'Watch Our Story',
      buttonLink: '/about',
      isVideo: true
    },
    {
      image: 'images/greens3.jpg',
      title: 'Organic Biofertilizers',
      description: 'High-quality organic fertilizers for healthier soil and better crop yields.',
      buttonText: 'Learn More',
      buttonLink: '/products/biofertilizers'
    },
    {
      image: 'images/greens4.jpg',
      title: 'Farmer Empowerment',
      description: 'Empowering smallholder farmers with training and sustainable agricultural practices.',
      buttonText: 'Join Our Program',
      buttonLink: '/regen-kilimo'
    },
    {
      image: 'images/greens5.jpg',
      title: 'Climate Resilience',
      description: 'Building resilient farming communities that thrive despite climate challenges.',
      buttonText: 'Our Impact',
      buttonLink: '/impact'
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