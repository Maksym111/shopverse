import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../../data/interfaces/products.interface';
import { CartProductInterf } from '../../data/interfaces/cartProduct.interface';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-product',
  imports: [CurrencyPipe],
  templateUrl: './cart-product.html',
  styleUrl: './cart-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartProduct implements OnInit {
  @Input() cartProduct!: CartProductInterf<Product>;
  count = 1;
  title = '';
  image = '';

  constructor(private cartService: CartService) {}

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
    this.cartService.reduceAmount(this.cartProduct.product.id);
  }

  addCount() {
    this.count += 1;
    this.cartService.addToCart(this.cartProduct.product);
  }

  removeProduct() {
    this.cartService.removeFromCart(this.cartProduct.product.id);
  }
}
