// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// Bootstrap the application
bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    console.log('🚀 Mzuri Organics application bootstrapped successfully');
    
    // Dispatch custom event to signal app is ready
    window.dispatchEvent(new CustomEvent('AppReady'));
  })
  .catch(err => {
    console.error('❌ Application bootstrap failed:', err);
    
    // Show user-friendly error message
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.innerHTML = `
        <div style="
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5dc 0%, #e8efe8 100%);
          padding: 20px;
          text-align: center;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            max-width: 500px;
          ">
            <h1 style="color: #3e8e0b; margin-bottom: 20px;">
              <i class="fas fa-exclamation-triangle"></i> Loading Error
            </h1>
            <p style="color: #666; margin-bottom: 20px;">
              We're having trouble loading Mzuri Organics. Please try refreshing the page.
            </p>
            <button onclick="window.location.reload()" style="
              background: #3e8e0b;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.3s ease;
            ">
              <i class="fas fa-sync-alt"></i> Refresh Page
            </button>
            <p style="margin-top: 20px; font-size: 0.9em; color: #999;">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      `;
    }
  });