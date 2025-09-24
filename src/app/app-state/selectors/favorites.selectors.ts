import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IInitialFavoritesReducer } from '../../data/interfaces/state/state.interface';

const selectFavoritesState =
  createFeatureSelector<IInitialFavoritesReducer>('favorites');

export const selectFavorites = createSelector(
  selectFavoritesState,
  (state) => state.favorites
);

export const selectFavoritesQuantity = createSelector(
  selectFavorites,
  (favorites) => favorites.length
);

export const isFavorite = (id: number) =>
  createSelector(
    selectFavorites,
    (favorites) => !!favorites.find((item) => item.id === id)
  );
