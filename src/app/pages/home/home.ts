import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../cart/cart';
import { HeroComponent } from '../../components/hero/hero';
import { CategoriesComponent } from '../../components/categories/categories';
import { FeaturesComponent } from '../../components/features/features';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent,CartComponent, CategoriesComponent,  FeaturesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent { }