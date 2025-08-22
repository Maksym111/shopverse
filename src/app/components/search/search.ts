import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  inputValue = '';
  private sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      this.activatedRoute.queryParams.subscribe((res) => {
        this.inputValue = res['search'] || '';
        this.cdr.markForCheck();
      })
    );

    this.sub.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e: any) => {
          if (!e.urlAfterRedirects.startsWith('/products')) {
            this.inputValue = '';
            this.cdr.markForCheck();
          }
        })
    );
  }

  onSubmit(e: Event) {
    e.preventDefault();

    this.router.navigate(['/products'], {
      queryParams: { search: this.inputValue.trim() || null },
    });

    this.searchInput.nativeElement.blur();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
