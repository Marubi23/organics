import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account-menu.html',
  styleUrls: ['./account-menu.css']
})
export class AccountMenuComponent {
  @Input() isOpen = false;
  @Input() currentUser: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  accountLinks = [
    { text: 'My Profile', icon: 'fas fa-user-circle', route: '/account/profile' },
    { text: 'My Orders', icon: 'fas fa-box', route: '/account/orders' },
    { text: 'Wishlist', icon: 'fas fa-heart', route: '/account/wishlist' },
    { text: 'Settings', icon: 'fas fa-cog', route: '/account/settings' },
    { text: 'Blog', icon: 'fas fa-newspaper', route: '/blog' },
    { text: 'FAQs', icon: 'fas fa-question-circle', route: '/faq' }
  ];

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}