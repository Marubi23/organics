// src/app/components/hamburger-menu/hamburger-menu.component.ts
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface HamburgerMenuItem {
  text: string;
  icon: string;
  route: string;
  children?: HamburgerMenuItem[];
  isOpen?: boolean;
}

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hamburger-menu.html',
  styleUrls: ['./hamburger-menu.css']
})
export class HamburgerMenuComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();
  
  // Mobile menu items matching your routes
  menuItems: HamburgerMenuItem[] = [
    { text: 'Home', icon: 'fas fa-home', route: '/home' },
    { text: 'Shop', icon: 'fas fa-shopping-bag', route: '/shop' },
    { 
      text: 'Products', 
      icon: 'fas fa-box-open', 
      route: '/products',
      children: [
        { text: 'Biofertilizers', icon: 'fas fa-vial', route: '/products' },
        { text: 'Animal Feeds', icon: 'fas fa-paw', route: '/products' },
        { text: 'All Products', icon: 'fas fa-boxes', route: '/products' }
      ]
    },
    { 
      text: 'About', 
      icon: 'fas fa-info-circle', 
      route: '/about',
      children: [
        { text: 'Overview', icon: 'fas fa-eye', route: '/about' },
        { text: 'What We Do', icon: 'fas fa-hands-helping', route: '/what-we-do' },
        { text: 'Challenges', icon: 'fas fa-exclamation-triangle', route: '/challenges' },
        { text: 'Impacts', icon: 'fas fa-chart-line', route: '/impacts' }
      ]
    },
    { text: 'Testimonials', icon: 'fas fa-comment', route: '/testimonials' },
    { text: 'Blog', icon: 'fas fa-blog', route: '/blog' },
    { text: 'FAQ', icon: 'fas fa-question-circle', route: '/faq' },
    { text: 'Contact', icon: 'fas fa-envelope', route: '/contact' },
    { text: 'Sign Up', icon: 'fas fa-user-plus', route: '/signup' },
    { text: 'Login', icon: 'fas fa-sign-in-alt', route: '/login' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  onClose() {
    this.closeMenu.emit();
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.onClose();
  }

  toggleSubmenu(item: HamburgerMenuItem) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    } else {
      this.navigate(item.route);
    }
  }
}