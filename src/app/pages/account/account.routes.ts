import { Routes } from '@angular/router';
import { AccountComponent } from '../account/account';
import { LoginComponent } from '../login/login';
import { SignupComponent } from '../signup/signup';
import { ProfileComponent } from '../profile/profile';
import { OrdersComponent } from '../orders/orders';
import { FarmDataComponent } from '../farm-data/farm-data';
import { DashboardComponent } from '../dashboard/dashboard';
import { AuthGuard } from '../../guards/auth.guard';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      // Redirect empty path based on auth status
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full'
      },
      { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [AuthGuard] 
      },
      { 
        path: 'login', 
        component: LoginComponent 
      },
      { 
        path: 'signup', 
        component: SignupComponent 
      },
      { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [AuthGuard] 
      },
      { 
        path: 'orders', 
        component: OrdersComponent, 
        canActivate: [AuthGuard] 
      },
      { 
        path: 'farm-data', 
        component: FarmDataComponent, 
        canActivate: [AuthGuard] 
      }
    ]
  }
];