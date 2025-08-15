import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartProduct } from '../../components/cart-product/cart-product';
import { CartService } from '../../services/cart-service';
import { CartProductInterf } from '../../data/interfaces/cartProduct.interface';
import { Product } from '../../data/interfaces/products.interface';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  imports: [CartProduct, CurrencyPipe],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage implements OnInit, OnDestroy {
  cartProducts: CartProductInterf<Product>[] = [];
  allProductsPrice = 0;
  tax = 3;

  private subscriptions: Subscription[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    const cartSub = this.cartService.cart$.subscribe(
      (cart) => (this.cartProducts = cart)
    );

    const priceSub = this.cartService.totalPrice$.subscribe(
      (price) => (this.allProductsPrice = price)
    );

    this.subscriptions.push(cartSub, priceSub);
  }

  get totalPrice() {
    return this.allProductsPrice + this.tax;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe);
  }
}
