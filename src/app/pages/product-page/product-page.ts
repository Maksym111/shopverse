import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../data/interfaces/products.interface';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { Reviews } from '../../components/reviews/reviews';
import { Tabs } from '../../data/types/tabs.type';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-page',
  imports: [CurrencyPipe, UpperCasePipe, IconSvg, Reviews, CommonModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit, OnDestroy {
  subscriptionProduct!: Subscription;
  product: Product | null = null;
  countProduct = 1;

  tabName: Tabs = 'reviews';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptionProduct = this.route.data.subscribe((data) => {
      this.product = data['product'];
    });
  }

  addCount() {
    this.countProduct += 1;
  }

  reduceCount() {
    if (this.countProduct <= 1) {
      return;
    }
    this.countProduct -= 1;
  }

  onTabClick(valueBtn: Tabs) {
    if (valueBtn !== this.tabName) {
      this.tabName = valueBtn;
    }
  }

  ngOnDestroy(): void {
    this.subscriptionProduct.unsubscribe();
  }

  addToCartBtn() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.countProduct);
      this.snackBar.open('Product added to the cart!', 'Ok', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 4000,
        panelClass: ['snackbar-success'],
      });
    }
  }
}
