import { Route } from '@angular/router';

export default [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent),
  },
] satisfies Route[];
