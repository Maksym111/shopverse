import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addToFavorites,
  removeFromFavorites,
} from '../actions/favorites.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);

  private storageKey = 'favorites';

  private updateLocalStorage(updateFn: (favorites: any[]) => any[]) {
    const favorites = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const updated = updateFn(favorites);
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  addFavorites$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addToFavorites),
        tap(({ product }) => {
          this.updateLocalStorage((favorites) => [...favorites, product]);
        })
      ),
    { dispatch: false }
  );

  removeFromFavorite$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeFromFavorites),
        tap(({ id }) => {
          this.updateLocalStorage((favorites) =>
            favorites.filter((item) => item.id !== id)
          );
        })
      ),
    { dispatch: false }
  );
}
