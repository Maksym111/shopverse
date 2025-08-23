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
import { combineLatest, map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  imports: [CartProduct, CurrencyPipe, AsyncPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  tax = 3;

  cartProducts$!: Observable<CartProductInterf<Product>[]>;
  allProductsPrice$!: Observable<number>;

  totalPrice$!: Observable<number>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartProducts$ = this.cartService.cart$.pipe(map((cart) => [...cart]));

    this.allProductsPrice$ = this.cartService.totalPrice$;

    this.totalPrice$ = combineLatest([this.allProductsPrice$]).pipe(
      map(([totalPrice]) => totalPrice + this.tax)
    );
  }
}
