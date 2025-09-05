import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../data/interfaces/products.interface';
import {
  CommonModule,
  CurrencyPipe,
  NgClass,
  UpperCasePipe,
} from '@angular/common';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { Reviews } from '../../components/reviews/reviews';
import { Tabs } from '../../data/types/tabs.type';
import { map } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-page',
  imports: [CurrencyPipe, UpperCasePipe, IconSvg, Reviews, NgClass],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage {
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  product = toSignal(
    this.route.data.pipe(map((data) => data['product'] as Product)),
    { initialValue: null }
  );

  countProduct = signal(1);

  tabName: Tabs = 'reviews';

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
      this.cartService.addToCart(product, this.countProduct());
      this.snackBar.open('Product added to the cart!', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 4000,
        panelClass: ['snackbar-success'],
      });
    }
  }
}
