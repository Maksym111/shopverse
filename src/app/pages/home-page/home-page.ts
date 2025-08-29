import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardProduct } from '../../components/card-product/card-product';
import { ProductService } from '../../services/product/product';
import { Product } from '../../data/interfaces/products.interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, CardProduct, CommonModule, AsyncPipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  productService = inject(ProductService);

  activeFeturedCategory: string = '';

  products$!: Observable<Product[]>;
  featuredProducts$!: Observable<Product[]>;

  private cache = new Map<string, Observable<Product[]>>();

  ngOnInit(): void {
    this.products$ = this.productService
      .getMensShirts({
        limit: 4,
        sortBy: 'minimumOrderQuantity',
        order: 'desc',
      })
      .pipe(map((res) => res.products));

    this.setFeatureCategory('women');
  }

  setFeatureCategory(categoryName: string) {
    if (this.activeFeturedCategory === categoryName) return;

    this.activeFeturedCategory = categoryName;

    if (this.cache.has(categoryName)) {
      this.featuredProducts$ = this.cache.get(categoryName)!;
      return;
    }

    const values = this.getValuesFromCategory(categoryName)!;

    this.cache.set(categoryName, values);
    this.featuredProducts$ = values;
  }

  getValuesFromCategory(categoryName: string) {
    let obs$: Observable<Product[]>;

    switch (categoryName) {
      case 'women': {
        obs$ = this.productService
          .getWomenDresses({ limit: 4 })
          .pipe(shareReplay(1));

        break;
      }

      case 'sport': {
        obs$ = this.productService
          .getSportsAccessories({ limit: 4 })
          .pipe(shareReplay(1));

        break;
      }

      default:
        return;
    }

    return obs$;
  }
}
