import { ICartProduct } from '../cartProduct.interface';
import { Product } from '../products.interface';

export interface IInitialCartReducer<T> {
  cart: ICartProduct<T>[];
}

export interface IInitialFavoritesReducer {
  favorites: Product[];
}
