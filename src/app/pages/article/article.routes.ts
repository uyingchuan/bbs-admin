import { Route } from '@angular/router';

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () => import('./article-list/article-list.component').then((c) => c.ArticleListComponent),
  },
] satisfies Route[];
