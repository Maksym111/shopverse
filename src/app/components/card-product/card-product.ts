import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Product } from '../../data/interfaces/products.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-product',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card-product.html',
  styleUrl: './card-product.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardProduct implements OnInit {
  @Input() product!: Product;

  linkProduct = '';

  ngOnInit(): void {
    this.linkProduct = `/products/${this.product.id}`;
  }
}
