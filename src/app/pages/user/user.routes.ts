import { Route } from '@angular/router';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () => import('./user-list/user-list.component').then((c) => c.UserListComponent),
  },
] satisfies Route[];
