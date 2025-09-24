import { createReducer, on } from '@ngrx/store';
import {
  addToFavorites,
  removeFromFavorites,
} from '../actions/favorites.actions';
import { IInitialFavoritesReducer } from '../../data/interfaces/state/state.interface';

const savedFavorite = JSON.parse(localStorage.getItem('favorites') || '[]');

const initialState: IInitialFavoritesReducer = {
  favorites: savedFavorite,
};

export const favoritesReducer = createReducer(
  initialState,
  on(addToFavorites, (state, props) => {
    const isExistId = state.favorites.find(
      (item) => item.id === props.product.id
    );

    if (isExistId) {
      return state;
    }

    return { ...state, favorites: [...state.favorites, props.product] };
  }),
  on(removeFromFavorites, (state, props) => {
    const udatedFavourites = state.favorites.filter(
      (item) => item.id !== props.id
    );

    return { ...state, favorites: udatedFavourites };
  })
);
