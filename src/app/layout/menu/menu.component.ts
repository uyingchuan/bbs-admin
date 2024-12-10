import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import _ from 'lodash';
import { ScrollbarModule } from '@components/scrollbar/scrollbar.module';
import { Alignment, OverlayPanelComponent } from '@components/overlay-panel/overlaypanel';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgForOf, NgIf, NgTemplateOutlet, RouterLink, OverlayPanelComponent, RouterLinkActive, ScrollbarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class MenuComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChildren('subMenuListTmpl') subMenuListTmpl!: QueryList<OverlayPanelComponent>;

  @Input()
  menuList: MenuItem[] = [];

  private routeSubscription!: Subscription;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private layout: LayoutService,
  ) {
    this.effectMenuCollapse();
  }

  ngOnInit() {
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouterActive();
      });
  }

  ngAfterViewInit() {
    this.updateRouterActive();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  updateRouterActive() {
    const collapse = this.layout.menuCollapse();
    this.menuList.forEach((item) => {
      const hasActiveLinks = this.hasActiveLinks(item);
      item['activated'] = hasActiveLinks;
      item.expanded = collapse ? false : hasActiveLinks;
    });
    this.cdr.detectChanges();
  }

  isActiveCheck(menu: MenuItem, checkFn: (menu: MenuItem) => boolean): boolean {
    if (checkFn(menu)) {
      return true;
    }
    if (menu.items) {
      for (const child of menu.items) {
        if (checkFn(child)) {
          return true;
        }
      }
    }
    return false;
  }

  expandMenu(menu: MenuItem, event: MouseEvent, index: number) {
    const collapse = this.layout.menuCollapse();
    if (collapse) {
      this.subMenuListTmpl.get(index)!.toggle(event);
      return;
    }

    if (!menu.items?.length) return;

    const expanded = menu.expanded;
    this.collapseMenuList(this.menuList);
    menu.expanded = !expanded;
  }

  private effectMenuCollapse() {
    effect(() => {
      const menuCollapse = this.layout.menuCollapse();
      if (menuCollapse) {
        this.menuList.forEach((menu) => {
          menu.expanded = false;
        });
      } else {
        this.updateRouterActive();
      }
    });
  }

  private hasActiveLinks(menu: MenuItem): boolean {
    const isLinkActiveFn = this.isLinkActive(this.router);
    return isLinkActiveFn(menu) || (menu.items ?? []).some((item) => this.isActiveCheck(item, isLinkActiveFn));
  }

  private isLinkActive(router: Router): (menu: MenuItem) => boolean {
    return (menu: MenuItem) =>
      router.isActive(menu.routerLink || '', {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
  }

  private collapseMenuList(tree: MenuItem[]): void {
    _.forEach(tree, (node) => {
      node.expanded = false;
      if (node.items) {
        this.collapseMenuList(node.items);
      }
    });
  }

  protected readonly Alignment = Alignment;
}
