import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';
import { LoginGuard } from '@guards/login.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@pages/auth/auth.routes'),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: 'home',
        component: LayoutComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/home',
  },
];
