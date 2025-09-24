import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { tap } from 'rxjs/operators';
import {
  addToCart,
  reduceAmountCartProduct,
  removeFromCart,
} from '../actions/cart.actions';
import { Product } from '../../data/interfaces/products.interface';
import { ICartProduct } from '../../data/interfaces/cartProduct.interface';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);

  private storageKey = 'cart';

  private updateLocalStorage(
    updateFn: (cart: ICartProduct<Product>[]) => ICartProduct<Product>[]
  ) {
    const cart = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const updated = updateFn(cart);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  addCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addToCart),
        tap(({ product, quantity }) => {
          this.updateLocalStorage((cart) => {
            const existProduct = cart.find(
              (item) => item.product.id === product.id
            );

            if (existProduct) {
              const udatedCart = cart.map((item) =>
                item.product.id === existProduct.product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );

              return udatedCart;
            }

            return [...cart, { product, quantity }];
          });
        })
      ),
    { dispatch: false }
  );

  decreaseAmountCartProduct$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(reduceAmountCartProduct),
        tap(({ productId }) => {
          this.updateLocalStorage((cart) =>
            cart.map((item) =>
              item.product.id === productId && item.quantity > 1
                ? { product: item.product, quantity: item.quantity - 1 }
                : item
            )
          );
        })
      ),
    { dispatch: false }
  );

  removeFromCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeFromCart),
        tap(({ productId }) => {
          this.updateLocalStorage((cart) =>
            cart.filter((item) => item.product.id !== productId)
          );
        })
      ),
    { dispatch: false }
  );
}
