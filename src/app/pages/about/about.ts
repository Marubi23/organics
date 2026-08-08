// about.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart';

interface SDG {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  isVideoPlaying: boolean = false;

  sdgs: SDG[] = [
    { number: '1', title: 'No Poverty', description: 'Creating new income streams for farmers, youth, and women' },
    { number: '2', title: 'Zero Hunger', description: 'Boosting food security by regenerating soils and increasing yields' },
    { number: '3', title: 'Gender Equality', description: 'Empowering women in agriculture through training and leadership' },
    { number: '4', title: 'Responsible Consumption', description: 'Transforming organic waste into high-value fertilizers' },
    { number: '5', title: 'Climate Action', description: 'Reducing emissions and building climate-resilient farms' },
    { number: '6', title: 'Life on Land', description: 'Restoring degraded soils and improving biodiversity' }
  ];

  ngAfterViewInit() {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const video = this.heroVideo.nativeElement;
      
      // Preload video metadata
      video.preload = 'metadata';
      // Sound always on
      video.muted = false;

      // Event listeners
      video.addEventListener('play', () => {
        this.isVideoPlaying = true;
      });

      video.addEventListener('pause', () => {
        this.isVideoPlaying = false;
      });

      video.addEventListener('ended', () => {
        // Loop the video
        video.currentTime = 0;
        video.play();
      });
    }
  }

  ngOnDestroy() {
    // Clean up video to prevent memory leaks
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const video = this.heroVideo.nativeElement;
      video.pause();
      video.removeEventListener('play', () => {});
      video.removeEventListener('pause', () => {});
      video.removeEventListener('ended', () => {});
    }
  }

  playVideo(): void {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const video = this.heroVideo.nativeElement;
      
      // Attempt to play
      video.play()
        .then(() => {
          this.isVideoPlaying = true;
        })
        .catch(error => {
          console.error('Error playing video:', error);
        });
    }
  }

  toggleVideoPlay(): void {
    if (this.heroVideo && this.heroVideo.nativeElement) {
      const video = this.heroVideo.nativeElement;
      if (video.paused) {
        this.playVideo();
      } else {
        video.pause();
        this.isVideoPlaying = false;
      }
    }
  }
}