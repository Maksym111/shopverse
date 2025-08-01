import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../data/interfaces/products.interface';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { Reviews } from '../../components/reviews/reviews';
import { Tabs } from '../../data/types/tabs.type';

@Component({
  selector: 'app-product-page',
  imports: [CurrencyPipe, UpperCasePipe, IconSvg, Reviews, CommonModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  route = inject(ActivatedRoute);

  product: Product | null = null;
  countProduct = 1;

  tabName: Tabs = 'reviews';

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
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
}
