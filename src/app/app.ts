import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { LoadingComponent } from './components/loading/loading';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent,
    LoadingComponent
  ],
  template: `
    <!-- Loading overlay -->
    @if (loadingService.isLoading()) {
      @let config = loadingService.config();
      <app-loading
        [type]="config.type || 'dual'"
        [size]="config.size || 'md'"
        [backdrop]="config.backdrop !== false">
      </app-loading>
    }
    
    <!-- Main layout -->
    <div class="app-container" [class.loading-active]="loadingService.isLoading()">
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Main content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      position: relative;
    }
    
    .app-container.loading-active {
      opacity: 0.7;
      filter: blur(1px);
      pointer-events: none;
      transition: opacity 0.3s ease, filter 0.3s ease;
    }
    
    .main-content {
      flex: 1;
      padding-top: 80px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        padding-top: 60px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(public loadingService: LoadingService) {}

  ngOnInit() {
    // Optional: Show loading on app start for 1.5 seconds
    setTimeout(() => {
      this.loadingService.showFullPage();
    }, 100);

    setTimeout(() => {
      this.loadingService.hide();
    }, 1500);
  }
}