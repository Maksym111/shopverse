import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../data/interfaces/breadcrumb.interface';
import { BreadcrumbService } from '../../services/breadcrumb-service';
import { AsyncPipe } from '@angular/common';
import { IconSvg } from '../icon-svg/icon-svg';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, RouterLink, IconSvg],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isHomePage = true;

  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }

  navList = [
    { name: 'Home', path: '/' },
    {
      name: 'Categories',
      path: 'categories',
      sublinks: [{ name: '', path: '' }],
    },
    { name: 'About', path: 'about' },
    { name: 'Contact', path: 'contact' },
  ];
}
