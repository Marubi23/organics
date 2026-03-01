import { Component } from '@angular/core';
import { CartComponent } from '../cart/cart';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.html',
  styleUrls: ['./returns.css'],
  imports: [CartComponent],
  standalone: true
})
export class ReturnsComponent {
  constructor() { }
}