import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Data,
  NavigationEnd,
  Router,
} from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { Breadcrumb } from '../../data/interfaces/breadcrumb.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Construct the breadcrumb hierarchy
        const root = this.router.routerState.snapshot.root;
        const breadcrumbs = this.addBreadcrumb(root, []);
        // this.addBreadcrumb(root, [], breadcrumbs);

        // const breadcrumbs = this.buildBreadcrumbs(
        //   this.router.routerState.snapshot.root
        // );
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private addBreadcrumb(
    route: ActivatedRouteSnapshot,
    parentUrl: string[]
  ): Breadcrumb[] {
    if (!route) return [];

    const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
    const breadcrumbs: Breadcrumb[] = [];

    if (route.data['breadcrumb']) {
      breadcrumbs.push({
        label: this.getLabel(route.data),
        url: '/' + routeUrl.join('/'),
      });
    }

    this.qwe(route, parentUrl, breadcrumbs);

    if (route.firstChild) {
      breadcrumbs.push(...this.addBreadcrumb(route.firstChild, routeUrl));
    }

    return breadcrumbs;
  }

  qwe(
    route: ActivatedRouteSnapshot,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[]
  ) {
    const children = route.parent?.routeConfig?.children ?? this.router.config;

    const siblings = children.filter((r) => r.data?.['breadcrumb']);
    for (const r of siblings) {
      if (!r.path) continue;

      if (route.routeConfig?.path?.includes(r.path)) {
        const urlSegments = parentUrl.concat(r.path.split('/'));
        const url = '/' + urlSegments.join('/');

        const rawLabel = r.data!['breadcrumb'];
        // Для соседей корректно работает только статический label (функции оставим для активного пути)
        const label = typeof rawLabel === 'function' ? undefined : rawLabel;
        if (!label) continue;

        if (!breadcrumbs.some((b) => b.url === url)) {
          breadcrumbs.unshift({ label, url });
        }
      }
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function'
      ? data['breadcrumb'](data)
      : data['breadcrumb'];
  }
}
