import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hamburger-menu.html',
  styleUrls: ['./hamburger-menu.css']
})
export class HamburgerMenuComponent {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  isAboutOpen = false;
  isProductsOpen = false;

  menuItems = [
    { text: 'Home', route: '/home' },
    { text: 'Blog', route: '/blog' }
  ];

  aboutChildren = [
    { text: 'Who We Are', route: '/about' },
    { text: 'What We Do', route: '/what-we-do' },
    { text: 'Challenges We Address', route: '/challenges' },
    { text: 'Impacts', route: '/impacts' }
  ];

  productChildren = [
    { text: 'Biofertilizers', route: '/products' },
    { text: 'Organic Solutions', route: '/products' },
    { text: 'Shop All', route: '/products' }
  ];

  constructor(private router: Router) {}

  onClose() {
    this.closeMenu.emit();
    // Close dropdowns
    this.isAboutOpen = false;
    this.isProductsOpen = false;
  }

  toggleAbout() {
    this.isAboutOpen = !this.isAboutOpen;
    if (this.isAboutOpen) {
      this.isProductsOpen = false;
    }
  }

  toggleProducts() {
    this.isProductsOpen = !this.isProductsOpen;
    if (this.isProductsOpen) {
      this.isAboutOpen = false;
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}