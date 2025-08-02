import { Component, OnInit } from '@angular/core';
import { Select } from '../../components/select/select';
import { IconSvg } from '../../components/icon-svg/icon-svg';
import { CardProduct } from '../../components/card-product/card-product';
import { Product } from '../../data/interfaces/products.interface';
import { ProductService } from '../../services/product/product';
import { Pagination } from '../../components/pagination/pagination';
import {
  CategoryFilterInterf,
  FiltersInterf,
} from '../../data/interfaces/filters.interface';
import { Filters } from '../../components/filters/filters';
import { ProductQueryParams } from '../../data/interfaces/productQueryParams.interface';

@Component({
  selector: 'app-search-page',
  imports: [Select, IconSvg, Filters, CardProduct, Pagination],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage implements OnInit {
  productList: Product[] = [];

  totalProductsNumb = 0;
  limitPerPage = 9;
  pageProduct = 1;

  appliedFilters: CategoryFilterInterf[] = [];

  selectSort = [
    { label: 'Not selected', value: 'not-selected', selected: true },
    { label: 'Ascending title', value: 'asc-title', selected: false },
    { label: 'Descending title', value: 'desc-title', selected: false },
    { label: 'Ascending price', value: 'asc-price', selected: false },
    { label: 'Descending price', value: 'desc-price', selected: false },
  ];

  constructor(private productService: ProductService) {}

  get currentSetProducts() {
    return this.pageProduct * this.limitPerPage - (this.limitPerPage - 1);
  }

  getInitAllProducts({
    order = '',
    sortBy = '',
    limit = 0,
    skip = 0,
  }: ProductQueryParams) {
    const limitPerPage = limit || this.limitPerPage || 0;

    this.productService
      .getAllProducts({
        limit: limitPerPage,
        skip,
        order,
        sortBy,
      })
      .subscribe((res) => {
        this.totalProductsNumb = res.total;
        this.productList = res.products;
      });
  }

  ngOnInit(): void {
    this.getInitAllProducts({});
  }

  getPaginationNumbs() {
    return Math.ceil(this.totalProductsNumb / this.limitPerPage);
  }

  getSelectedNewData(
    data: { label: string; value: string; selected: boolean }[]
  ) {
    this.selectSort = [...data];

    const sortName = this.selectSort.find((elem) => elem.selected);

    this.sortProductsBy(sortName?.value);
  }

  sortProductsBy(sort: string = 'not-selected') {
    this.pageProduct = 1;

    switch (sort) {
      case 'asc-title': {
        this.productService
          .getAllProducts({
            limit: this.limitPerPage,
            sortBy: 'title',
            order: 'asc',
          })
          .subscribe((res) => {
            this.totalProductsNumb = res.total;
            this.productList = res.products;
          });
        break;
      }

      case 'desc-title': {
        this.productService
          .getAllProducts({
            limit: this.limitPerPage,
            sortBy: 'title',
            order: 'desc',
          })
          .subscribe((res) => {
            this.totalProductsNumb = res.total;
            this.productList = res.products;
          });

        break;
      }

      case 'asc-price': {
        this.productService
          .getAllProducts({
            limit: this.limitPerPage,
            sortBy: 'price',
            order: 'asc',
          })
          .subscribe((res) => {
            this.totalProductsNumb = res.total;
            this.productList = res.products;
          });
        break;
      }

      case 'desc-price': {
        this.productService
          .getAllProducts({
            limit: this.limitPerPage,
            sortBy: 'price',
            order: 'desc',
          })
          .subscribe((res) => {
            this.totalProductsNumb = res.total;
            this.productList = res.products;
          });

        break;
      }

      default: {
        this.getInitAllProducts({});
      }
    }
  }

  getCurrentPage(number: number) {
    const skipElements = (number - 1) * 9;

    let sortSelectedValue = this.selectSort.find(
      (elem) => elem.selected
    )!.value;
    let order = '';
    let sortBy = '';

    if (sortSelectedValue !== 'not-selected') {
      const sortValues = sortSelectedValue.split('-');
      order = sortValues[0];
      sortBy = sortValues[1];
    }

    this.getInitAllProducts({
      limit: this.limitPerPage,
      skip: skipElements,
      order,
      sortBy,
    });

    this.pageProduct = number;
  }

  getFilters(filters: FiltersInterf) {
    if (filters.category?.length) {
      this.appliedFilters = [...filters.category];

      this.productService
        .getProductsByCategory(filters.category)
        .subscribe((res) => {
          this.totalProductsNumb = res.total;
          this.productList = res.products;
        });
    } else {
      this.getInitAllProducts({});

      this.appliedFilters = [];
    }
  }
}
