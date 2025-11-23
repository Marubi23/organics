// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { ProductsComponent } from './components/products/products';
import { WhatWeDoComponent } from './pages/what-we-do/what-we-do';
import { ImpactComponent } from './components/impacts/impacts';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: HomeComponent }, // or create a separate ShopComponent if needed
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'what-we-do', component: WhatWeDoComponent },
  {path: 'impacts', component: ImpactComponent},
  { path: '**', redirectTo: '' } // Wildcard route for 404 pages
];