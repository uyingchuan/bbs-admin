import { Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { Breadcrumb } from 'primeng/breadcrumb';
import { NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { LoginService } from '@services/login.service';
import { LayoutService } from '../layout.service';
import _ from 'lodash';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Button, Breadcrumb, NgIf, RouterLink, PrimeTemplate],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  breadItems?: MenuItem[];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private layoutService: LayoutService,
  ) {
    this.router.events.pipe(filter((r) => r instanceof NavigationEnd)).subscribe(() => {
      this.setCrumb();
    });
  }

  ngOnInit() {}

  signOut() {
    this.loginService.setSignOut();
    this.router.navigate(['/auth/login']).then();
  }

  setCrumb() {
    const crumbs: MenuItem[] = [];
    const menuList = this.layoutService.menuList();
    const routerLink = this.router.url.split('?')[0];
    const currentMenu = _.find(menuList, (menu) => menu.routerLink === routerLink);
    if (currentMenu && currentMenu['parentId']) {
      let parentMenu = _.find(menuList, (menu) => menu.id === currentMenu['parentId']);
      crumbs.unshift(parentMenu!);
      while (parentMenu && parentMenu['parentId']) {
        parentMenu = _.find(menuList, (menu) => menu.id === currentMenu['parentId']);
        if (parentMenu) {
          crumbs.unshift(parentMenu);
        }
      }
      crumbs.push(currentMenu);
    } else {
      crumbs.push(currentMenu ?? { label: '404' });
    }
    this.breadItems = crumbs;
  }
}
