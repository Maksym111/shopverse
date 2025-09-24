import { createAction, props } from '@ngrx/store';
import { Product } from '../../data/interfaces/products.interface';

export const addToCart = createAction(
  '[Product Page] Add To Cart',
  props<{ product: Product; quantity: number }>()
);
export const removeFromCart = createAction(
  '[Cart Page] Remove From Cart',
  props<{ productId: number }>()
);

export const reduceAmountCartProduct = createAction(
  '[Cart Page] Decrease Product Amount',
  props<{ productId: number }>()
);
