import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero';
import { CategoriesComponent } from '../../components/categories/categories';
import { ProductsComponent } from '../../components/products/products';
import { FeaturesComponent } from '../../components/features/features';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, CategoriesComponent, ProductsComponent, FeaturesComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent { }