import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Products, Product } from '../../data/interfaces/products.interface';
import { ProductQueryParams } from '../../data/interfaces/productQueryParams.interface';
import { forkJoin, map, shareReplay } from 'rxjs';
import { CategoryFilterInterf } from '../../data/interfaces/filters.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);

  baseApiUrl = 'https://dummyjson.com/';

  private setParams(query: ProductQueryParams): HttpParams {
    let params = new HttpParams();

    for (let key in query) {
      const value = query[key as keyof ProductQueryParams];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    }

    return params;
  }

  getAllProducts(sort: ProductQueryParams = {}) {
    const params = this.setParams(sort);

    return this.http.get<Products>(`${this.baseApiUrl}products`, { params });
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.baseApiUrl}products/${id}`);
  }

  getProductsByReview() {
    const params = this.setParams({ limit: 0 });

    return this.http
      .get<Products>(`${this.baseApiUrl}products/category/mens-shirts`, {
        params,
      })
      .pipe(
        map(({ products }) =>
          products.filter((elem) =>
            elem.reviews?.some((review) => review.rating === 5)
          )
        )
      );
  }

  getMensShirts(sort: ProductQueryParams = {}) {
    const params = this.setParams(sort);

    return this.http.get<Products>(
      `${this.baseApiUrl}products/category/mens-shirts`,
      { params }
    );
  }

  getWomenDresses(sort: ProductQueryParams = {}) {
    const params = this.setParams(sort);

    return this.http.get<Products>(
      `${this.baseApiUrl}products/category/womens-dresses`,
      { params }
    );
  }

  getSportsAccessories(sort: ProductQueryParams = {}) {
    const params = this.setParams(sort);

    return this.http.get<Products>(
      `${this.baseApiUrl}products/category/sports-accessories`,
      { params }
    );
  }

  getCategoryList() {
    return this.http
      .get<string[]>(`${this.baseApiUrl}products/category-list`)
      .pipe(
        map((res) =>
          res.map((value, index) => ({
            id: index,
            value,
            checked: false,
          }))
        ),
        shareReplay(1)
      );
  }

  getProductsByCategory(categories: CategoryFilterInterf[]) {
    const requests = categories.map((elem) =>
      this.http.get<Products>(
        `${this.baseApiUrl}products/category/${elem.value}`
      )
    );

    return forkJoin(requests).pipe(
      map((response) => {
        const allProducts = response.flatMap((res) => res.products);
        const countProducts = response.reduce((sum, res) => sum + res.total, 0);
        const countSkip = response.reduce((sum, res) => sum + res.skip, 0);
        const countLimit = response.reduce((sum, res) => sum + res.limit, 0);

        return {
          products: allProducts,
          total: countProducts,
          skip: countSkip,
          limit: countLimit,
        };
      })
    );
  }

  getProductsBySearch(sort: ProductQueryParams = {}) {
    const params = this.setParams(sort);

    return this.http.get<Products>(`${this.baseApiUrl}products/search`, {
      params,
    });
  }
}
