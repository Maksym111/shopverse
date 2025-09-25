import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { selectCartTotalPrice } from '../../app-state/selectors/cart.selectors';

@Component({
  selector: 'app-cart-order-summary',
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './cart-order-summary.html',
  styleUrl: './cart-order-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartOrderSummary implements OnInit {
  tax = 3;

  shipping$!: Observable<number | string>;
  allProductsPrice$!: Observable<number>;
  totalPrice$!: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.allProductsPrice$ = this.store.select(selectCartTotalPrice);

    this.shipping$ = this.allProductsPrice$.pipe(
      map((price) => (price > 100 ? 'Free' : 10))
    );

    this.totalPrice$ = combineLatest([
      this.allProductsPrice$,
      this.shipping$,
    ]).pipe(
      map(([totalPrice, shipping]) => totalPrice + this.tax + (+shipping || 0))
    );
  }
}
