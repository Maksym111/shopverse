import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoryFilterInterf } from '../../../data/interfaces/filters.interface';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-category-filter',
  imports: [],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilter implements OnInit {
  @Output() categoriesEmit = new EventEmitter<CategoryFilterInterf[]>();

  checkedCategories: CategoryFilterInterf[] = [];

  isOpenFilter = false;

  allCategories: CategoryFilterInterf[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  showMoreFilters() {
    this.isOpenFilter = !this.isOpenFilter;
  }

  getAllCategories() {
    this.productService.getCategoryList().subscribe((res) => {
      this.allCategories = res.map((value, index) => ({
        id: index,
        value,
      }));
    });
  }

  chooseCategory(e: Event, item: CategoryFilterInterf) {
    const input = e.target as HTMLInputElement;

    if (input.checked) {
      this.checkedCategories.push({
        id: item.id,
        value: item.value,
      });
    } else {
      this.checkedCategories = this.checkedCategories.filter(
        (elem) => elem.id !== item.id
      );
    }

    this.categoriesEmit.emit(this.checkedCategories);
  }
}
