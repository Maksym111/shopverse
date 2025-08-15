import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Filters {
  @Output() filtersEmitted = new EventEmitter<FiltersInterf | null>();

  allFiltersData: FiltersInterf | null = null;
  appliedAllFilters: FiltersInterf | null = null;

  isHidden = true;

  getAllCategoryFilters(values: CategoryFilterInterf[]) {
    if (!values.length && !this.appliedAllFilters?.category?.length) {
      this.isHidden = true;
      return;
    }

    let isNewCategoris = true;

    if (this.appliedAllFilters?.category) {
      isNewCategoris = this.isChangedCategories(
        this.appliedAllFilters?.category,
        values
      );
    }

    this.isHidden = !isNewCategoris;

    this.allFiltersData = { category: [...values] };
  }

  apllyFilters() {
    this.appliedAllFilters = { ...this.allFiltersData };

    this.filtersEmitted.emit({ ...this.appliedAllFilters });

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
    this.allFiltersData = null;
    this.appliedAllFilters = null;
    this.filtersEmitted.emit(null);
    this.isHidden = true;
  }
}
