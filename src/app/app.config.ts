import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { loadingInterceptor } from './interceptors/loading.interceptor'; // Correct import path

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration with enhanced features
    provideRouter(
      routes,
      withViewTransitions(), // Enable view transitions for smoother route changes
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Scroll to top on navigation
        anchorScrolling: 'enabled' // Enable anchor scrolling
      })
    ),
    
    // HTTP client with interceptors and SSR compatibility
    provideHttpClient(
      withFetch(), // Use Fetch API for SSR compatibility
      withInterceptors([loadingInterceptor]) // Add loading interceptor
    ),
    
    // Client hydration for SSR
    provideClientHydration(),
    
    // Animations
    provideAnimations()
  ]
};