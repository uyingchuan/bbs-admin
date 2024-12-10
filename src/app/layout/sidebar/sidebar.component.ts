import { Component } from '@angular/core';
import { NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Button } from 'primeng/button';
import { Sidebar } from 'primeng/sidebar';
import { LayoutService } from '../layout.service';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { ScrollbarModule } from '@components/scrollbar/scrollbar.module';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    NgIf,
    Button,
    Sidebar,
    PrimeTemplate,
    RouterLink,
    ScrollbarModule,
    NgOptimizedImage,
    MenuComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  get menuList(): MenuItem[] {
    return this.layoutService.menuTree;
  }

  get menuCollapse(): boolean {
    return this.layoutService.menuCollapse();
  }

  get sidebarVisible(): boolean {
    return this.layoutService.sidebarVisible();
  }

  set sidebarVisible(value) {
    this.layoutService.sidebarVisible.set(value);
  }

  constructor(private layoutService: LayoutService) {}

  toggleMenuCollapse() {
    this.layoutService.menuCollapse.update((value) => !value);
  }
}
