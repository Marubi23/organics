import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent
  ],
  template: `
    <!-- Main layout - No loading overlay -->
    <div class="app-container">
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
export class AppComponent {}