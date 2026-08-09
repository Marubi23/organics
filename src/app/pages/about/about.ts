// about.component.ts
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartComponent } from '../cart/cart';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, CartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  isVideoPlaying = false;

  // Bound references so removeEventListener actually works
  private onPlay = () => {
    this.isVideoPlaying = true;
    this.cdr.markForCheck();
  };

  private onPause = () => {
    this.isVideoPlaying = false;
    this.cdr.markForCheck();
  };

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    video.preload = 'metadata';
    video.muted = false;

    // 'loop' attribute on the <video> tag already handles replay —
    // no manual 'ended' listener needed, that was doing duplicate work.
    video.addEventListener('play', this.onPlay);
    video.addEventListener('pause', this.onPause);
  }

  ngOnDestroy(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    video.pause();
    video.removeEventListener('play', this.onPlay);
    video.removeEventListener('pause', this.onPause);
  }

  playVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    video.play()
      .then(() => {
        this.isVideoPlaying = true;
        this.cdr.markForCheck();
      })
      .catch(err => console.error('Error playing video:', err));
  }

  toggleVideoPlay(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    if (video.paused) {
      this.playVideo();
    } else {
      video.pause();
      this.isVideoPlaying = false;
      this.cdr.markForCheck();
    }
  }

  // Single handler reused by every lazy image — pure DOM class toggle,
  // deliberately NOT touching Angular state so it costs nothing on OnPush.
  onImgLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
    img.parentElement?.classList.add('loaded');
  }
}