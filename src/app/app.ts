import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { HeroComponent } from './components/hero/hero';
import { CategoriesComponent } from './components/categories/categories';
import { ProductsComponent } from './components/products/products';
import { FeaturesComponent } from './components/features/features';
import { CartComponent } from './pages/cart/cart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    CartComponent,
    HeaderComponent, 
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'mzuri-organics';
}