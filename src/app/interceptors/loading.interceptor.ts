import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  let activeRequests = 0;

  // Skip loading for specific requests
  const skipLoading = 
    req.url.includes('assets/') || // Skip for assets
    req.method === 'GET' && !req.url.includes('api'); // Skip for non-API GET requests

  if (!skipLoading) {
    activeRequests++;
    
    if (activeRequests === 1) {
      // Show inline loading for API calls - NO PARAMETER
      loadingService.showInline();
    }
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        activeRequests--;
        
        if (activeRequests === 0) {
          setTimeout(() => {
            loadingService.hide();
          }, 300);
        }
      }
    })
  );
};