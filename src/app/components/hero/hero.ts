import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  private slideInterval: any;
  private isUserInteracting = false;

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

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

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      if (!this.isUserInteracting) {
        this.nextSlide();
      }
    }, 5000); // Increased to 5 seconds for better UX
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextSlide() {
    // Pause video if current slide is video
    if (this.slides[this.currentSlide].isVideo && this.videoElement) {
      this.videoElement.nativeElement.pause();
    }

    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    
    // Play video if next slide is video
    this.playCurrentVideo();
  }

  prevSlide() {
    // Pause video if current slide is video
    if (this.slides[this.currentSlide].isVideo && this.videoElement) {
      this.videoElement.nativeElement.pause();
    }

    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    
    // Play video if previous slide is video
    this.playCurrentVideo();
  }

  goToSlide(index: number) {
    // Pause video if current slide is video
    if (this.slides[this.currentSlide].isVideo && this.videoElement) {
      this.videoElement.nativeElement.pause();
    }

    this.currentSlide = index;
    
    // Play video if new slide is video
    this.playCurrentVideo();
    
    // Restart auto-slide with delay
    this.restartAutoSlide();
  }

  private playCurrentVideo() {
    if (this.slides[this.currentSlide].isVideo && this.videoElement) {
      setTimeout(() => {
        this.videoElement.nativeElement.play().catch(e => {
          console.log('Video play failed:', e);
        });
      }, 100);
    }
  }

  private restartAutoSlide() {
    this.stopAutoSlide();
    setTimeout(() => {
      this.startAutoSlide();
    }, 3000);
  }

  // Handle user interaction
  onUserInteraction() {
    this.isUserInteracting = true;
    this.stopAutoSlide();
    
    // Restart auto-slide after 10 seconds of inactivity
    setTimeout(() => {
      this.isUserInteracting = false;
      this.startAutoSlide();
    }, 10000);
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