import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../../data/interfaces/products.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProduct implements OnInit {
  @Input() product!: Product;

  cart$ = inject(CartService);
  private snackBar = inject(MatSnackBar);

  linkProduct = '';

  ngOnInit(): void {
    this.linkProduct = `/products/${this.product.id}`;
  }

  addToCart() {
    this.cart$.addToCart(this.product);

    this.snackBar.open('Product added to the cart!', 'Ok', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: ['snackbar-success'],
    });
  }
}
