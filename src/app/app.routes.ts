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
import { SignupComponent } from './pages/signup/signup';
import { TermsComponent } from './pages/terms/terms';
import { PrivacyComponent } from './pages/privacy/privacy';
import { ReturnsComponent } from './pages/returns/returns'; 
import { LoginComponent } from './pages/login/login';
import { OrderSuccessComponent } from './pages/order-success/order-success';
import { NotFoundComponent } from './components/not-found/not-found';
import { BlogJobPostComponent } from './components/blog/blog-job-post/blog-post';

export const routes: Routes = [
  // === PAGES WITHOUT HEADER/FOOTER (Full page) ===
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  
  // === PAGES WITH HEADER/FOOTER ===
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'what-we-do', component: WhatWeDoComponent },
  { path: 'impacts', component: ImpactComponent },
  { path: 'cart', component: CartComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'challenges', component: ProblemsComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'returns', component: ReturnsComponent },
  { path: 'shop', component: HomeComponent },
  
  // Job Post Routes
  { path: 'careers/graduate-research-assistant', component: BlogJobPostComponent },
  { path: 'blog/job/graduate-research-assistant', component: BlogJobPostComponent },
  { path: 'ff-bio-job', redirectTo: '/careers/graduate-research-assistant', pathMatch: 'full' },

  // Account Module (Lazy loaded)
  { 
    path: 'account', 
    loadChildren: () => import('./pages/account/account.routes').then(m => m.ACCOUNT_ROUTES)
  },

  // 404 - Not Found
  { path: '**', component: NotFoundComponent }  
];