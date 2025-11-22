// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

// Add your component imports based on what files actually exist
// If your files are named differently, update these imports:
import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';