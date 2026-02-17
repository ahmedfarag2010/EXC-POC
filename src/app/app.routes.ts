import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'services',
    loadChildren: () => import('./features/services/services.module').then(m => m.ServicesModule),
    canActivate: [authGuard]
  },
  {
    path: 'my-requests',
    loadChildren: () => import('./features/requests/requests.module').then(m => m.RequestsModule),
    canActivate: [authGuard]
  },
  {
    path: 'my-tasks',
    loadChildren: () => import('./features/requests/requests-tasks/requests-tasks.module').then(m => m.RequestsTasksModule),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
