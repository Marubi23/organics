// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { ProductsComponent } from './components/products/products';
import { WhatWeDoComponent } from './pages/what-we-do/what-we-do';
import { ImpactComponent } from './components/impacts/impacts';
import { CartComponent } from './pages/cart/cart';
import { TestimonialsComponent } from './components/testimonials/testimonials';
import { BlogComponent } from './components/blog/blog';
import { ProblemsComponent } from './components/problems/problems';
import { FaqComponent } from './components/faq/faq';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderSuccessComponent } from './pages/order-success/order-success';
// REMOVE: import { LoginComponent } from './pages/login/login'; // Remove this

export const routes: Routes = [
  { path: 'order-success', component: OrderSuccessComponent },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'challenges', component: ProblemsComponent },
  { path: 'shop', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'what-we-do', component: WhatWeDoComponent },
  { path: 'impacts', component: ImpactComponent },
  { path: 'cart', component: CartComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'checkout', component: CheckoutComponent },


  { 
    path: 'account', 
    loadChildren: () => import('./pages/account/account.routes').then(m => m.ACCOUNT_ROUTES)
  },

  { path: '**', redirectTo: '' }
];