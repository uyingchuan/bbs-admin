import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, OnSameUrlNavigation, RouteReuseStrategy } from '@angular/router';
import _ from 'lodash';

export interface RouteReuseStorage {
  key: string;
  handle: DetachedRouteHandle;
}

@Injectable({
  providedIn: 'root',
})
export class RouteStrategyService implements RouteReuseStrategy {
  private static waitDelete: string[] = [];

  public static storages: RouteReuseStorage[] = [];

  onSameUrlNavigation: OnSameUrlNavigation = 'ignore';

  // 删除路由缓存 (不考虑路由参数)
  public static deleteRouteSnapshot(path: string) {
    const key = path.replace(/\//g, '_').split('?')[0];
    _.remove(RouteStrategyService.storages, (s) => s.key.split('?')[0] === key);
    RouteStrategyService.waitDelete.push(key);
  }

  // 删除所有路由缓存 (不考虑路由参数)
  public static deleteAllRouteSnapshot() {
    RouteStrategyService.storages.every((s) => {
      RouteStrategyService.waitDelete.push(s.key);
      _.remove(RouteStrategyService.storages, (st) => st.key === s.key);
    });
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const isParentRoute = route.routeConfig?.children || route.routeConfig?.loadChildren;
    const noCache = !_.find(RouteStrategyService.storages, (s) => s.key === RouteStrategyService.getRouteUrl(route));
    if ((!route.data['keepParent'] && isParentRoute) || noCache) {
      return null;
    }
    const storage = _.find(RouteStrategyService.storages, (s) => s.key === RouteStrategyService.getRouteUrl(route));
    return storage!.handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const hasCache = !!_.find(RouteStrategyService.storages, (s) => s.key === RouteStrategyService.getRouteUrl(route));
    const notParent = !route.routeConfig?.children && !route.routeConfig?.loadChildren;
    return (route.data['keepParent'] || notParent) && hasCache && this.onSameUrlNavigation === 'ignore';
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !route.data['keepFresh'] && this.onSameUrlNavigation === 'ignore';
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig && this.onSameUrlNavigation !== 'reload';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle === null) {
      return;
    }
    const key = RouteStrategyService.getRouteUrl(route);
    if (RouteStrategyService.waitDelete.includes(key)) {
      _.remove(RouteStrategyService.waitDelete, key);
      return;
    }
    _.remove(RouteStrategyService.storages, (s) => s.key === RouteStrategyService.getRouteUrl(route));
    RouteStrategyService.storages = [...RouteStrategyService.storages, { key, handle }];
  }

  private static getRouteUrl(route: ActivatedRouteSnapshot): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return route['_routerState'].url.replace(/\//g, '_').split('?')[0];
  }
}
