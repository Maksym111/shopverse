import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../data/interfaces/breadcrumb.interface';
import { BreadcrumbService } from '../../services/breadcrumb/breadcrumb-service';
import { AsyncPipe } from '@angular/common';
import { IconSvg } from '../icon-svg/icon-svg';
import { CartService } from '../../services/cart-service';
import { Search } from '../search/search';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, RouterLink, IconSvg, Search],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  productsAmount$ = new Observable<number>();

  breadcrumbs$: Observable<Breadcrumb[]>;

  isLoggedIn$!: Observable<boolean>;

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  navList = [
    { name: 'Home', path: '/' },
    {
      name: 'Categories',
      path: 'products',
      sublinks: [],
    },
    // { name: 'About', path: 'about' },
    // { name: 'Contact', path: 'contact' },
  ];

  ngOnInit(): void {
    this.productsAmount$ = this.cartService.totalAmountProducts$;

    this.isLoggedIn$ = this.authService.isAuth$;
  }

  onLogout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
