import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CategoryFilterInterf } from '../../../data/interfaces/filters.interface';
import { ProductService } from '../../../services/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-filter',
  imports: [FormsModule],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilter implements OnInit, OnChanges {
  @Input() categoryFilters: CategoryFilterInterf[] | undefined = [];
  @Output() categoriesEmit = new EventEmitter<CategoryFilterInterf[]>();

  checkedCategories: CategoryFilterInterf[] = [];

  isOpenFilter = false;

  allCategories: CategoryFilterInterf[] = [];

  constructor(private productService: ProductService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoryFilters']) {
      this.switchFilteredCategories(this.categoryFilters);
    }
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  showMoreFilters() {
    this.isOpenFilter = !this.isOpenFilter;
  }

  getAllCategories() {
    this.productService.getCategoryList().subscribe((res) => {
      this.allCategories = res.map((value, index) => {
        return {
          id: index,
          value,
          checked: false,
        };
      });
    });
  }

  chooseCategory(e: Event, item: CategoryFilterInterf) {
    const input = e.target as HTMLInputElement;

    if (input.checked) {
      this.checkedCategories.push({
        id: item.id,
        value: item.value,
        checked: true,
      });
    } else {
      this.checkedCategories = this.checkedCategories.filter(
        (elem) => elem.id !== item.id
      );
    }

    this.categoriesEmit.emit(this.checkedCategories);
  }

  switchFilteredCategories(
    categoryFilters: CategoryFilterInterf[] | undefined
  ) {
    if (categoryFilters?.length === 0) {
      this.allCategories = this.allCategories.map((elem) => ({
        ...elem,
        checked: false,
      }));
      this.checkedCategories = [];
    }
    // else if (categoryFilters?.length) {
    //   this.allCategories = this.allCategories.map((elem) => {
    //     const isChecked = !!categoryFilters.find(
    //       (filtCat) => filtCat.value === elem.value
    //     );

    //     this.checkedCategories.push(elem);

    //     return {
    //       ...elem,
    //       checked: isChecked,
    //     };
    //   });
    // }
  }
}
