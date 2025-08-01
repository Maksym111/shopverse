import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryFilter } from './category-filter/category-filter';
import {
  CategoryFilterInterf,
  FiltersInterf,
} from '../../data/interfaces/filters.interface';

@Component({
  selector: 'app-filters',
  imports: [CategoryFilter],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  @Input() appliedFilters: CategoryFilterInterf[] = [];
  @Output() filtersEmitted = new EventEmitter<FiltersInterf>();

  allFiltersData: FiltersInterf | null = null;

  isHidden = true;

  getAllCategoryFilters(values: CategoryFilterInterf[]) {
    const isNewCategoris = this.isChangedCategories(
      this.appliedFilters,
      values
    );

    this.isHidden = !isNewCategoris;

    this.allFiltersData = { category: [...values] };
  }

  apllyFilters() {
    if (this.allFiltersData) {
      this.filtersEmitted.emit(this.allFiltersData);
    }

    this.isHidden = true;
  }

  isChangedCategories(
    aplliedCategories: CategoryFilterInterf[],
    newCategories: CategoryFilterInterf[]
  ) {
    const getIdArr = (arr: CategoryFilterInterf[]) =>
      arr.map((elem) => elem.id);

    const appliedIds = getIdArr(aplliedCategories);
    const newIds = getIdArr(newCategories);

    const arrsAreEqual =
      appliedIds.length === newIds.length &&
      appliedIds.every((elem) => newIds.includes(elem));

    return !arrsAreEqual;
  }

  clearAll() {
    this.allFiltersData = { category: [] };
    this.filtersEmitted.emit(this.allFiltersData);
    this.isHidden = true;
  }
}
