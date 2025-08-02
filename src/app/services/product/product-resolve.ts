import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { Product } from '../../data/interfaces/products.interface';
import { ProductService } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductResolverService implements Resolve<Product> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product> {
    const id = route.params['id'];
    return this.productService.getProductById(id);
  }
}
