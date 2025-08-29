import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SubscribeForm } from '../subscribe-form/subscribe-form';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SubscribeForm],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer implements OnInit {
  currenYear = new Date().getFullYear();
  isSpecUrl = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isSpecUrl = e.url === '/login' || this.router.url === '/cart';
        this.cdr.markForCheck();
      });

    this.isSpecUrl =
      this.router.url === '/login' || this.router.url === '/cart';
  }
}
