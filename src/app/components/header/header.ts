import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../data/interfaces/breadcrumb.interface';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb-service';
import { AsyncPipe } from '@angular/common';
import { IconSvg } from '../icon-svg/icon-svg';
import { Search } from '../search/search';
import { AuthService } from '../../core/auth-service';
import { Store } from '@ngrx/store';
import { selectCartQuantity } from '../../app-state/selectors/cart.selectors';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, IconSvg, Search],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  productsAmount$ = new Observable<number>();
  isLoggedIn$!: Observable<boolean>;
  breadcrumbs$: Observable<Breadcrumb[]>;

  isSticky = false;

  navList = [
    { name: 'Home', path: '' },
    {
      name: 'Categories',
      path: 'products',
      sublinks: [],
    },
    { name: 'Favorites', path: 'favorites' },
    // { name: 'Contact', path: 'contact' },
  ];

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  ngOnInit(): void {
    this.productsAmount$ = this.store.select(selectCartQuantity);

    this.isLoggedIn$ = this.authService.isAuth$;
  }

  onLogout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
