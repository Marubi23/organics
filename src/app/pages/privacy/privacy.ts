import { Component } from '@angular/core';
import { CartComponent } from '../cart/cart';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
  imports: [CartComponent],
  standalone: true,
  styleUrls: ['./privacy.css']
})
export class PrivacyComponent {
  constructor() { }
}