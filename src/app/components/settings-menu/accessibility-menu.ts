import { Component, Output, EventEmitter, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  dyslexiaFriendly: boolean;
  underlineLinks: boolean;
  largeCursor: boolean;
  readingGuide: boolean;
}

@Component({
  selector: 'app-accessibility-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accessibility-menu.html',
  styleUrls: ['./accessibility-menu.css']
})
export class AccessibilityMenuComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  // Settings
  fontSize: 'small' | 'medium' | 'large' = 'medium';
  highContrast = false;
  reducedMotion = false;
  screenReader = false;
  dyslexiaFriendly = false;
  underlineLinks = false;
  largeCursor = false;
  readingGuide = false;

  private readingGuideElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.loadSettings();
    this.applySettings();
  }

  // Font Size Controls
  decreaseFontSize() {
    if (this.fontSize === 'large') this.fontSize = 'medium';
    else if (this.fontSize === 'medium') this.fontSize = 'small';
    this.applyFontSize();
    this.saveSettings();
  }

  increaseFontSize() {
    if (this.fontSize === 'small') this.fontSize = 'medium';
    else if (this.fontSize === 'medium') this.fontSize = 'large';
    this.applyFontSize();
    this.saveSettings();
  }

  private applyFontSize() {
    // Remove existing font classes
    this.renderer.removeClass(document.body, 'font-small');
    this.renderer.removeClass(document.body, 'font-medium');
    this.renderer.removeClass(document.body, 'font-large');
    
    // Add new font class
    this.renderer.addClass(document.body, `font-${this.fontSize}`);

    // Apply font size to root
    const root = document.documentElement;
    switch(this.fontSize) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
  }

  // Toggle Methods
  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    if (this.highContrast) {
      this.renderer.addClass(document.body, 'high-contrast');
    } else {
      this.renderer.removeClass(document.body, 'high-contrast');
    }
    this.saveSettings();
  }

  toggleReducedMotion() {
    this.reducedMotion = !this.reducedMotion;
    if (this.reducedMotion) {
      this.renderer.addClass(document.body, 'reduced-motion');
    } else {
      this.renderer.removeClass(document.body, 'reduced-motion');
    }
    this.saveSettings();
  }

  toggleScreenReader() {
    this.screenReader = !this.screenReader;
    if (this.screenReader) {
      this.renderer.addClass(document.body, 'screen-reader');
    } else {
      this.renderer.removeClass(document.body, 'screen-reader');
    }
    this.saveSettings();
  }

  toggleDyslexiaFriendly() {
    this.dyslexiaFriendly = !this.dyslexiaFriendly;
    if (this.dyslexiaFriendly) {
      this.renderer.addClass(document.body, 'dyslexia-friendly');
    } else {
      this.renderer.removeClass(document.body, 'dyslexia-friendly');
    }
    this.saveSettings();
  }

  toggleUnderlineLinks() {
    this.underlineLinks = !this.underlineLinks;
    if (this.underlineLinks) {
      this.renderer.addClass(document.body, 'underline-links');
    } else {
      this.renderer.removeClass(document.body, 'underline-links');
    }
    this.saveSettings();
  }

  toggleLargeCursor() {
    this.largeCursor = !this.largeCursor;
    if (this.largeCursor) {
      this.renderer.addClass(document.body, 'large-cursor');
    } else {
      this.renderer.removeClass(document.body, 'large-cursor');
    }
    this.saveSettings();
  }

  toggleReadingGuide() {
    this.readingGuide = !this.readingGuide;
    if (this.readingGuide) {
      this.renderer.addClass(document.body, 'reading-guide');
      this.initReadingGuide();
    } else {
      this.renderer.removeClass(document.body, 'reading-guide');
      this.destroyReadingGuide();
    }
    this.saveSettings();
  }

  // Reading Guide
  private initReadingGuide() {
    if (!this.readingGuideElement) {
      this.readingGuideElement = this.renderer.createElement('div');
      this.renderer.addClass(this.readingGuideElement, 'reading-guide-element');
      this.renderer.appendChild(document.body, this.readingGuideElement);

      // Add mouse move listener
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (this.readingGuideElement && this.readingGuide) {
      const y = event.clientY;
      this.renderer.setStyle(this.readingGuideElement, 'top', `${y - 15}px`);
    }
  }

  private destroyReadingGuide() {
    if (this.readingGuideElement) {
      this.renderer.removeChild(document.body, this.readingGuideElement);
      this.readingGuideElement = null;
      document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }

  // Reset All
  resetAll() {
    // Reset all settings to default
    this.fontSize = 'medium';
    this.highContrast = false;
    this.reducedMotion = false;
    this.screenReader = false;
    this.dyslexiaFriendly = false;
    this.underlineLinks = false;
    this.largeCursor = false;
    this.readingGuide = false;
    
    // Remove all classes
    this.renderer.removeClass(document.body, 'font-small');
    this.renderer.removeClass(document.body, 'font-medium');
    this.renderer.removeClass(document.body, 'font-large');
    this.renderer.removeClass(document.body, 'high-contrast');
    this.renderer.removeClass(document.body, 'reduced-motion');
    this.renderer.removeClass(document.body, 'screen-reader');
    this.renderer.removeClass(document.body, 'dyslexia-friendly');
    this.renderer.removeClass(document.body, 'underline-links');
    this.renderer.removeClass(document.body, 'large-cursor');
    this.renderer.removeClass(document.body, 'reading-guide');
    
    // Reset font size
    document.documentElement.style.fontSize = '16px';
    
    // Destroy reading guide if exists
    this.destroyReadingGuide();
    
    this.saveSettings();
  }

  // Save/Load Settings
  private saveSettings() {
    const settings: AccessibilitySettings = {
      fontSize: this.fontSize,
      highContrast: this.highContrast,
      reducedMotion: this.reducedMotion,
      screenReader: this.screenReader,
      dyslexiaFriendly: this.dyslexiaFriendly,
      underlineLinks: this.underlineLinks,
      largeCursor: this.largeCursor,
      readingGuide: this.readingGuide
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        const settings = JSON.parse(saved) as AccessibilitySettings;
        this.fontSize = settings.fontSize || 'medium';
        this.highContrast = settings.highContrast || false;
        this.reducedMotion = settings.reducedMotion || false;
        this.screenReader = settings.screenReader || false;
        this.dyslexiaFriendly = settings.dyslexiaFriendly || false;
        this.underlineLinks = settings.underlineLinks || false;
        this.largeCursor = settings.largeCursor || false;
        this.readingGuide = settings.readingGuide || false;
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  }

  private applySettings() {
    this.applyFontSize();
    if (this.highContrast) this.renderer.addClass(document.body, 'high-contrast');
    if (this.reducedMotion) this.renderer.addClass(document.body, 'reduced-motion');
    if (this.screenReader) this.renderer.addClass(document.body, 'screen-reader');
    if (this.dyslexiaFriendly) this.renderer.addClass(document.body, 'dyslexia-friendly');
    if (this.underlineLinks) this.renderer.addClass(document.body, 'underline-links');
    if (this.largeCursor) this.renderer.addClass(document.body, 'large-cursor');
    if (this.readingGuide) {
      this.renderer.addClass(document.body, 'reading-guide');
      this.initReadingGuide();
    }
  }
}