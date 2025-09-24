import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IInitialCartReducer } from '../../data/interfaces/state/state.interface';
import { Product } from '../../data/interfaces/products.interface';

const selectCartState =
  createFeatureSelector<IInitialCartReducer<Product>>('cart');

export const selectCart = createSelector(
  selectCartState,
  (state) => state.cart
);

export const selectCartQuantity = createSelector(selectCart, (cart) =>
  cart.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectCartTotalPrice = createSelector(selectCart, (cart) =>
  cart.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0)
);
