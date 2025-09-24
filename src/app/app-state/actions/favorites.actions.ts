import { createAction, props } from '@ngrx/store';
import { Product } from '../../data/interfaces/products.interface';

export const addToFavorites = createAction(
  '[Product Page] Add To Favorites',
  props<{ product: Product }>()
);

export const removeFromFavorites = createAction(
  '[Product Page] Remove From Favorites',
  props<{ id: number }>()
);
