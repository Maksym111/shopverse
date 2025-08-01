import { Component, Input } from '@angular/core';
import { Product } from '../../data/interfaces/products.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
})
export class CardProduct {
  @Input() product!: Product;
}
