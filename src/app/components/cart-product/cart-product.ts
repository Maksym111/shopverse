import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../../data/interfaces/products.interface';
import { ICartProduct } from '../../data/interfaces/cartProduct.interface';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  addToCart,
  reduceAmountCartProduct,
  removeFromCart,
} from '../../app-state/actions/cart.actions';

@Component({
  selector: 'app-cart-product',
  imports: [CurrencyPipe],
  templateUrl: './cart-product.html',
  styleUrl: './cart-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartProduct implements OnInit {
  @Input() cartProduct!: ICartProduct<Product>;
  count = 1;
  title = '';
  image = '';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.title = this.cartProduct.product.title;
    this.count = this.cartProduct.quantity;
    this.image =
      this.cartProduct.product.thumbnail ||
      '../../../assets/images/no-product.svg';
  }

  get price() {
    return this.cartProduct.product.price * this.cartProduct.quantity;
  }

  reduceCount() {
    this.count -= 1;
    this.store.dispatch(
      reduceAmountCartProduct({ productId: this.cartProduct.product.id })
    );
  }

  addCount() {
    this.count += 1;
    this.store.dispatch(
      addToCart({
        product: this.cartProduct.product,
        quantity: 1,
      })
    );
  }

  removeProduct() {
    this.store.dispatch(
      removeFromCart({ productId: this.cartProduct.product.id })
    );
  }
}
