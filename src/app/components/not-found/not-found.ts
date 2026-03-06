// src/app/components/not-found/not-found.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <!-- Animated 404 text -->
        <div class="number-404">
          <span class="digit">4</span>
          <span class="zero">
            <i class="fas fa-leaf"></i>
          </span>
          <span class="digit">4</span>
        </div>
        
        <h1>Page Not Found</h1>
        <p class="message">Oops! The page you're looking for seems to have wandered off into the organic wilderness.</p>
        
        <div class="suggestions">
          <p>Here are some helpful links instead:</p>
          <div class="quick-links">
            <a routerLink="/" class="home-link">
              <i class="fas fa-home"></i> Home
            </a>
            <a routerLink="/products" class="shop-link">
              <i class="fas fa-shopping-bag"></i> Shop Products
            </a>
            <a routerLink="/contact" class="contact-link">
              <i class="fas fa-envelope"></i> Contact Us
            </a>
          </div>
        </div>
        
        <!-- Auto-redirect countdown -->
        <div class="redirect-message">
          <p>Taking you home in <span class="countdown">{{ countdown }}</span> seconds...</p>
          <a routerLink="/" class="redirect-now">Go Home Now</a>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="leaf-decoration leaf-1">
        <i class="fas fa-leaf"></i>
      </div>
      <div class="leaf-decoration leaf-2">
        <i class="fas fa-seedling"></i>
      </div>
      <div class="leaf-decoration leaf-3">
        <i class="fas fa-tree"></i>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #f5f5dc 0%, #e8f0e8 100%);
    }
    
    .not-found-content {
      max-width: 600px;
      text-align: center;
      position: relative;
      z-index: 2;
      animation: fadeInUp 0.6s ease;
    }
    
    .number-404 {
      font-size: 8rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #2d6a02;
    }
    
    .digit {
      text-shadow: 4px 4px 0 rgba(62, 142, 11, 0.2);
      animation: float 3s ease-in-out infinite;
    }
    
    .digit:nth-child(1) { animation-delay: 0s; }
    .digit:nth-child(3) { animation-delay: 0.2s; }
    
    .zero {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
      background: #3e8e0b;
      border-radius: 50%;
      color: white;
      font-size: 4rem;
      box-shadow: 0 10px 20px rgba(62, 142, 11, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }
    
    .zero i {
      animation: spin 10s linear infinite;
    }
    
    h1 {
      font-size: 2.5rem;
      color: #2c3e2c;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .message {
      font-size: 1.1rem;
      color: #5d735d;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .suggestions {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      margin-bottom: 25px;
    }
    
    .suggestions p {
      color: #2c3e2c;
      font-weight: 500;
      margin-bottom: 15px;
    }
    
    .quick-links {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .quick-links a {
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .home-link {
      background: #3e8e0b;
      color: white;
    }
    
    .home-link:hover {
      background: #2d6a02;
      transform: translateY(-2px);
    }
    
    .shop-link {
      background: #8B4513;
      color: white;
    }
    
    .shop-link:hover {
      background: #A0522D;
      transform: translateY(-2px);
    }
    
    .contact-link {
      background: #f0f0f0;
      color: #2c3e2c;
    }
    
    .contact-link:hover {
      background: #e0e0e0;
      transform: translateY(-2px);
    }
    
    .redirect-message {
      color: #5d735d;
      font-size: 0.95rem;
    }
    
    .countdown {
      font-weight: 700;
      color: #3e8e0b;
      font-size: 1.2rem;
    }
    
    .redirect-now {
      display: inline-block;
      margin-top: 10px;
      color: #3e8e0b;
      text-decoration: underline;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .redirect-now:hover {
      color: #2d6a02;
    }
    
    /* Decorative elements */
    .leaf-decoration {
      position: absolute;
      color: rgba(62, 142, 11, 0.1);
      z-index: 1;
    }
    
    .leaf-1 {
      top: 10%;
      left: 5%;
      font-size: 8rem;
      transform: rotate(-15deg);
      animation: float 8s ease-in-out infinite;
    }
    
    .leaf-2 {
      bottom: 10%;
      right: 5%;
      font-size: 10rem;
      transform: rotate(25deg);
      animation: float 10s ease-in-out infinite reverse;
    }
    
    .leaf-3 {
      top: 50%;
      right: 10%;
      font-size: 6rem;
      transform: rotate(45deg);
      animation: float 12s ease-in-out infinite;
    }
    
    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .number-404 {
        font-size: 6rem;
      }
      
      .zero {
        width: 90px;
        height: 90px;
        font-size: 3rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      .quick-links a {
        padding: 10px 20px;
        font-size: 0.9rem;
      }
    }
    
    @media (max-width: 480px) {
      .number-404 {
        font-size: 4rem;
      }
      
      .zero {
        width: 70px;
        height: 70px;
        font-size: 2.5rem;
      }
      
      h1 {
        font-size: 1.5rem;
      }
      
      .message {
        font-size: 1rem;
      }
      
      .quick-links {
        flex-direction: column;
      }
      
      .leaf-decoration {
        opacity: 0.2;
      }
    }
  `]
})
export class NotFoundComponent implements OnInit, OnDestroy {
  countdown = 10;
  private countdownInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}