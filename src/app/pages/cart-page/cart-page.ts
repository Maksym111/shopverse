import { Component } from '@angular/core';
import { CartProduct } from '../../components/cart-product/cart-product';

@Component({
  selector: 'app-cart-page',
  imports: [CartProduct],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {}
