import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  cartCount = 0;
  isMobileMenuOpen = false;

  constructor(private router: Router) {
    // Close mobile menu when route changes
    this.router.events.subscribe(() => {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    });
  }

  toggleCart() {
    console.log('Cart toggled');
    // Cart functionality will be implemented later
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  toggleMobileDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropdown = (event.target as HTMLElement).closest('.mobile-dropdown');
    const menu = dropdown?.querySelector('.mobile-dropdown-menu');
    const toggle = dropdown?.querySelector('.mobile-dropdown-toggle');
    
    if (menu && toggle) {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
    }
  }

  // Close mobile menu when clicking outside on mobile
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (this.isMobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.hamburger-menu')) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  // Close mobile menu on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  // Close mobile menu on window resize (if resizing to desktop)
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const window = event.target as Window;
    if (window.innerWidth > 968 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}