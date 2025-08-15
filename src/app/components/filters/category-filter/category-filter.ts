import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CategoryFilterInterf } from '../../../data/interfaces/filters.interface';
import { ProductService } from '../../../services/product/product';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-category-filter',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFilter implements OnInit {
  @Input() set appliedFilters(filters: CategoryFilterInterf[] | undefined) {
    this.checkedIds$.next(
      filters ? new Set(filters.map((f) => f.id)) : new Set()
    );
  }

  @Output() categoriesEmit = new EventEmitter<CategoryFilterInterf[]>();

  isOpenFilter = false;

  private checkedIds$ = new BehaviorSubject<Set<number>>(new Set());

  categories$!: Observable<CategoryFilterInterf[]>;

  categoriesWithChecked$!: Observable<CategoryFilterInterf[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getCategories();
    this.markChoosenCategories();
  }

  showMoreFilters() {
    this.isOpenFilter = !this.isOpenFilter;
  }

  getCategories() {
    this.categories$ = this.productService.getCategoryList();
  }

  markChoosenCategories() {
    this.categoriesWithChecked$ = combineLatest([
      this.categories$,
      this.checkedIds$,
    ]).pipe(
      map(([categories, checkedIds]) =>
        categories.map((cat) => ({
          ...cat,
          checked: checkedIds.has(cat.id),
        }))
      )
    );
  }

  chooseCategory(item: CategoryFilterInterf) {
    const updatedSet = new Set(this.checkedIds$.value);

    updatedSet.has(item.id)
      ? updatedSet.delete(item.id)
      : updatedSet.add(item.id);

    this.checkedIds$.next(updatedSet);

    this.categories$
      .pipe(
        take(1),
        map((categories) =>
          categories
            .filter((cat) => updatedSet.has(cat.id))
            .map((cat) => ({
              ...cat,
              checked: true,
            }))
        )
      )
      .subscribe((selected) => this.categoriesEmit.emit(selected));
  }
}
