import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../data/interfaces/products.interface';
import {
  AsyncPipe,
  CurrencyPipe,
  NgClass,
  UpperCasePipe,
} from '@angular/common';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { Reviews } from '../../components/reviews/reviews';
import { Tabs } from '../../data/types/tabs.type';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { addToCart } from '../../app-state/actions/cart.actions';
import { isFavorite } from '../../app-state/selectors/favorites.selectors';
import { Favorite } from '../../directives/favorite';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../app-state/actions/favorites.actions';

@Component({
  selector: 'app-product-page',
  imports: [
    CurrencyPipe,
    UpperCasePipe,
    AsyncPipe,
    IconSvg,
    Reviews,
    NgClass,
    Favorite,
  ],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);

  product = toSignal(
    this.activatedRoute.data.pipe(map((data) => data['product'] as Product)),
    { initialValue: null }
  );

  countProduct = signal(1);

  tabName: Tabs = 'reviews';

  isFavorite$!: Observable<boolean>;

  ngOnInit(): void {
    this.isFavorite$ = this.store.select(isFavorite(this.product()!.id));
  }

  addCount() {
    this.countProduct.update((val) => val + 1);
  }

  reduceCount() {
    if (this.countProduct() <= 1) {
      return;
    }
    this.countProduct.update((val) => val - 1);
  }

  onTabClick(valueBtn: Tabs) {
    if (valueBtn !== this.tabName) {
      this.tabName = valueBtn;
    }
  }

  addToCartBtn() {
    const product = this.product();

    if (product) {
      this.store.dispatch(
        addToCart({ product, quantity: this.countProduct() })
      );

      this.snackBar.open('Product added to the cart!', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 4000,
        panelClass: ['snackbar-success'],
      });
    }
  }

  addFavorite() {
    this.store.dispatch(addToFavorites({ product: this.product()! }));
  }

  removeFavorite() {
    this.store.dispatch(removeFromFavorites({ id: this.product()!.id }));
  }
}
