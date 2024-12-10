import { computed, Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  scales = [12, 13, 14, 15, 16];
  sidebarVisible = signal(false);
  menuCollapse = signal(false);

  menuTree: MenuItem[] = [
    {
      id: '0',
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/dashboard',
    },
    {
      id: '1',
      label: '文章管理',
      icon: 'pi pi-book',
      routerLink: '/article',
      items: [
        {
          id: '1-1',
          label: '文章列表',
          routerLink: '/article/list',
          parentId: '1',
        },
      ],
    },
    {
      id: '2',
      label: '用户管理',
      icon: 'pi pi-user',
      routerLink: '/user',
      items: [
        {
          id: '2-1',
          label: '用户列表',
          routerLink: '/user/list',
          parentId: '2',
        },
      ],
    },
    {
      id: '3',
      label: '权限管理',
      icon: 'pi pi-shield',
      routerLink: '/permission',
      items: [
        {
          id: '3-1',
          label: '菜单列表',
          routerLink: '/permission/menu/list',
          parentId: '3',
        },
        {
          id: '3-2',
          label: '超管列表',
          routerLink: '/permission/admin/list',
          parentId: '3',
        },
      ],
    },
  ];
  menuList = computed(() => {
    return this.convertTreeListToList(this.menuTree, []);
  });

  constructor() {}

  private convertTreeListToList(treeList: MenuItem[], result: MenuItem[]): MenuItem[] {
    treeList.forEach((tree) => {
      result.push(tree);
      this.convertTreeListToList(tree.items ?? [], result);
    });
    return result;
  }
}
