import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { filter } from 'rxjs/operators';

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
    <!-- Main layout -->
    <div class="app-container">
      <!-- Header - Hidden on checkout, login, signup, order-success -->
      <app-header *ngIf="showLayout"></app-header>
      
      <!-- Main content -->
      <main class="main-content" [class.no-header]="!showLayout">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer - Hidden on checkout, login, signup, order-success -->
      <app-footer *ngIf="showLayout"></app-footer>
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
    
    .main-content.no-header {
      padding-top: 0;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .main-content {
        padding-top: 60px;
      }
      
      .main-content.no-header {
        padding-top: 0;
      }
    }
  `]
})
export class AppComponent {
  showLayout: boolean = true;
  
  // Routes that should NOT show header/footer
  private noLayoutRoutes = ['/checkout', '/login', '/signup', '/order-success'];
  
  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateLayout(event.urlAfterRedirects);
    });
  }
  
  private updateLayout(url: string): void {
    // Check if current route should hide layout
    this.showLayout = !this.noLayoutRoutes.some(route => 
      url.startsWith(route)
    );
  }
}