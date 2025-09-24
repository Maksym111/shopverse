import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import { Select } from '../../components/select/select';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { CardProduct } from '../../components/card-product/card-product';
import {
  Product,
  ProductResponse,
} from '../../data/interfaces/products.interface';
import { ProductService } from '../../services/product/product';
import { Pagination } from '../../components/pagination/pagination';
import { FiltersInterf } from '../../data/interfaces/filters.interface';
import { Filters } from '../../components/filters/filters';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, ViewportScroller } from '@angular/common';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-page',
  imports: [Select, IconSvg, Filters, CardProduct, Pagination, AsyncPipe],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPage implements OnInit {
  private limitPerPage = 9;
  haveFilters = false;

  pageProduct = signal(1);
  pageProduct$ = toObservable(this.pageProduct);
  productsResponse$!: Observable<ProductResponse>;
  products$!: Observable<Product[]>;

  currentRange = computed(() => {
    const page = this.pageProduct();
    const total = this.totalProductsNumb();

    return {
      firstItem: total ? (page - 1) * this.limitPerPage + 1 : 0,
      lastItem: Math.min(page * this.limitPerPage, total),
    };
  });

  // search
  searchQuery$!: Observable<string | null>;

  // pagination
  totalProductsNumb = signal(0);
  paginationCount = computed(() =>
    Math.ceil(this.totalProductsNumb() / this.limitPerPage)
  );

  // filters and sort
  private filtersSubject = new BehaviorSubject<FiltersInterf | null>(null);
  filters$ = this.filtersSubject.asObservable();

  private sortSubject = new BehaviorSubject<string>('not-selected');
  sort$ = this.sortSubject.asObservable();

  selectSort = [
    { label: 'Not selected', value: 'not-selected', selected: true },
    { label: 'Ascending title', value: 'asc-title', selected: false },
    { label: 'Descending title', value: 'desc-title', selected: false },
    { label: 'Ascending price', value: 'asc-price', selected: false },
    { label: 'Descending price', value: 'desc-price', selected: false },
  ];

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private scroller: ViewportScroller,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchQuery$ = this.activatedRoute.queryParams.pipe(
      map((params) => {
        return params['search'] ?? null;
      }),
      distinctUntilChanged(),
      tap((_) => this.pageProduct.set(1))
    );

    this.getProductsResp();

    this.products$ = this.productsResponse$.pipe(map((res) => res.products));
  }

  setSort(newSort: string) {
    this.pageProduct.set(1);
    this.sortSubject.next(newSort);
  }

  setPage(newPage: number) {
    this.pageProduct.set(newPage);
    this.scroller.scrollToPosition([0, 0]);
  }

  setFilters(filters: FiltersInterf | null) {
    this.haveFilters = !!filters;

    this.pageProduct.set(1);
    this.filtersSubject.next(filters);

    this.router.navigate([], { queryParams: { search: null } });
  }

  private getOrderAndSorting(sort: string) {
    if (sort === 'not-selected') return { order: '', sortBy: '' };

    const [order, sortBy] = sort.split('-');
    return { order, sortBy };
  }

  getProductsResp() {
    this.productsResponse$ = combineLatest([
      this.sort$,
      this.filters$,
      this.searchQuery$,
      this.pageProduct$,
    ]).pipe(
      switchMap(([sort, filters, search, page]) => {
        const skip = (page - 1) * this.limitPerPage;
        const params = {
          limit: this.limitPerPage,
          skip,
          ...this.getOrderAndSorting(sort),
        };

        // if we have filters
        if (filters?.category && filters?.category.length > 0) {
          return this.productService.getProductsByCategory(filters.category);
        }

        // if we have search
        if (search) {
          return this.productService.getProductsBySearch({
            q: search,
            ...params,
          });
        }

        // default req
        return this.productService.getAllProducts({
          ...params,
        });
      }),
      tap((res) => this.totalProductsNumb.set(res.total)),
      shareReplay(1)
    );
  }
}
