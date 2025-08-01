import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardProduct } from '../../components/card-product/card-product';
import { ProductService } from '../../services/product';
import { Product } from '../../data/interfaces/products.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CardProduct, CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
  productService = inject(ProductService);

  activeFeturedCategory: string = '';

  products: Product[] = [];
  featuredProducts: Product[] = [];

  ngOnInit(): void {
    this.productService
      .getMensShirts({
        limit: 4,
        sortBy: 'minimumOrderQuantity',
        order: 'desc',
      })
      .subscribe((res) => {
        this.products = res.products;
      });

    this.setFeatureCategory('women');
  }

  setFeatureCategory(categoryName: string) {
    if (this.activeFeturedCategory === categoryName) return;

    this.activeFeturedCategory = categoryName;

    if (categoryName === 'women') {
      this.productService.getWomenDresses({ limit: 4 }).subscribe((res) => {
        this.featuredProducts = res.products;
      });
    } else if (categoryName === 'sport') {
      this.productService
        .getSportsAccessories({ limit: 4 })
        .subscribe((res) => {
          this.featuredProducts = res.products;
        });
    }
  }
}
