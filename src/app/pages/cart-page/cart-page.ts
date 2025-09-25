import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CartProduct } from '../../components/cart-product/cart-product';
import { ICartProduct } from '../../data/interfaces/cartProduct.interface';
import { Product } from '../../data/interfaces/products.interface';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCart } from '../../app-state/selectors/cart.selectors';
import { CartOrderSummary } from '../../components/cart-order-summary/cart-order-summary';

@Component({
  selector: 'app-cart-page',
  imports: [CartProduct, CurrencyPipe, AsyncPipe, RouterLink, CartOrderSummary],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage implements OnInit {
  cartProducts$!: Observable<ICartProduct<Product>[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.cartProducts$ = this.store.select(selectCart);
  }

  onCheckout(isNotEmptyCart: boolean) {
    if (isNotEmptyCart) {
      this.router.navigate(['/checkout']);
    }
  }
}
