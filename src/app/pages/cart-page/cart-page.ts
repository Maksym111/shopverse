import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CartProduct } from '../../components/cart-product/cart-product';
import { CartService } from '../../services/cart-service';
import { CartProductInterf } from '../../data/interfaces/cartProduct.interface';
import { Product } from '../../data/interfaces/products.interface';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { combineLatest, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [CartProduct, CurrencyPipe, AsyncPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  tax = 3;
  shipping$!: Observable<number | string>;

  cartProducts$!: Observable<CartProductInterf<Product>[]>;
  allProductsPrice$!: Observable<number>;

  totalPrice$!: Observable<number>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartProducts$ = this.cartService.cart$.pipe(map((cart) => [...cart]));

    this.allProductsPrice$ = this.cartService.totalPrice$;

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
