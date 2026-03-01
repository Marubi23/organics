import { Component } from '@angular/core';
import { CartComponent } from '../cart/cart';

@Component({
  selector: 'app-terms',
  imports: [CartComponent],
  standalone: true,
  templateUrl: './terms.html',
  styleUrls: ['./terms.css']
})
export class TermsComponent {
  constructor() { }
}