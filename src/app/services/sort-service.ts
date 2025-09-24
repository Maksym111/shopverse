import { Injectable } from '@angular/core';
import { Product } from '../data/interfaces/products.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private sortFuncs: { [key: string]: (a: any, b: any) => number } = {
    'asc-title': (a, b) => a.title.localeCompare(b.title),
    'desc-title': (a, b) => b.title.localeCompare(a.title),
    'asc-price': (a, b) => a.price - b.price,
    'desc-price': (a, b) => b.price - a.price,
  };

  sortProducts(products: Observable<Product[]>, sortValue: string) {
    const sortFn = this.sortFuncs[sortValue];

    return sortFn
      ? products.pipe(map((items) => [...items].sort(sortFn)))
      : products;
  }
}
