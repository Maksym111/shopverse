import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../../data/interfaces/products.interface';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addToCart } from '../../app-state/actions/cart.actions';
import { Favorite } from '../../directives/favorite';
import { Observable } from 'rxjs';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../app-state/actions/favorites.actions';
import { isFavorite } from '../../app-state/selectors/favorites.selectors';
import { IconSvg } from '../icon-svg/icon-svg';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe, AsyncPipe, RouterLink, Favorite, IconSvg],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProduct implements OnInit {
  @Input() product!: Product;

  linkProduct = '';
  isFavorite$!: Observable<boolean>;

  constructor(private snackBar: MatSnackBar, private store: Store) {}

  ngOnInit(): void {
    this.linkProduct = `/products/${this.product.id}`;

    this.isFavorite$ = this.store.select(isFavorite(this.product.id));
  }

  addFavorite() {
    this.store.dispatch(addToFavorites({ product: this.product }));
  }

  removeFavorite() {
    this.store.dispatch(removeFromFavorites({ id: this.product.id }));
  }

  addToCartBtn() {
    this.store.dispatch(addToCart({ product: this.product, quantity: 1 }));

    this.snackBar.open('Product added to the cart!', 'Ok', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: ['snackbar-success'],
    });
  }
}
