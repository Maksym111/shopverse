import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { Pagination } from '../../components/pagination/pagination';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import { Store } from '@ngrx/store';
import { Product } from '../../data/interfaces/products.interface';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { selectFavorites } from '../../app-state/selectors/favorites.selectors';
import { CardProduct } from '../../components/card-product/card-product';
import { Select } from '../../components/select/select';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { SortService } from '../../services/sort-service';

@Component({
  selector: 'app-favorites-page',
  imports: [Pagination, AsyncPipe, CardProduct, Select, IconSvg],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesPage implements OnInit {
  private limitPerPage = 12;

  initialProducts$!: Observable<Product[]>;
  products$!: Observable<Product[]>;

  currentRange = computed(() => {
    const page = this.pageProduct();
    const total = this.totalProductsNumb();

    return {
      firstItem: total ? (page - 1) * this.limitPerPage + 1 : 0,
      lastItem: Math.min(page * this.limitPerPage, total),
    };
  });

  // sort
  private sortSubject = new BehaviorSubject<string>('not-selected');
  sort$ = this.sortSubject.asObservable();

  selectSort = [
    { label: 'Not selected', value: 'not-selected', selected: true },
    { label: 'Ascending title', value: 'asc-title', selected: false },
    { label: 'Descending title', value: 'desc-title', selected: false },
    { label: 'Ascending price', value: 'asc-price', selected: false },
    { label: 'Descending price', value: 'desc-price', selected: false },
  ];

  // pagination
  pageProduct = signal(1);
  totalProductsNumb = signal(0);
  paginationCount = computed(() =>
    Math.ceil(this.totalProductsNumb() / this.limitPerPage)
  );

  constructor(
    private scroller: ViewportScroller,
    private store: Store,
    private sortService: SortService
  ) {}

  ngOnInit(): void {
    const favorites$ = this.store.select(selectFavorites).pipe(
      tap((products) => this.totalProductsNumb.set(products.length)),
      shareReplay(1)
    );

    this.initialProducts$ = favorites$;
    this.products$ = favorites$;
  }

  setSort(newSort: string) {
    this.pageProduct.set(1);

    this.products$ = this.sortService.sortProducts(
      this.initialProducts$,
      newSort
    );

    this.sortSubject.next(newSort);
  }

  setPage(newPage: number) {
    this.pageProduct.set(newPage);
    this.scroller.scrollToPosition([0, 0]);
  }
}
