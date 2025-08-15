import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IconSvg } from '../icon-svg/icon-svg';

@Component({
  selector: 'app-pagination',
  imports: [IconSvg],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  @Input() count = 1;
  @Input() currentPage = 1;

  @Output() pageEmmiter = new EventEmitter<number>();

  getCountPages(): number[] {
    return Array.from({ length: this.count }, (_, i) => i + 1);
  }

  trackByIndex(index: number, item: number | string): string {
    return typeof item === 'number' ? item.toString() : `${item}-${index}`;
  }

  onNextBtn() {
    this.currentPage += 1;
    this.pageEmmiter.emit(this.currentPage);
  }

  onPrevBtn() {
    this.currentPage -= 1;
    this.pageEmmiter.emit(this.currentPage);
  }

  makeArrPerPage(): (number | string)[] {
    const total = this.count;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total < 7) {
      pages.push(...this.getCountPages());
    } else if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }

    return pages;
  }

  changePage(e: Event) {
    const btn = e.target as HTMLButtonElement;
    const value = btn.textContent?.trim();
    const indexAttr = btn.getAttribute('data-index');
    const index = indexAttr ? parseInt(indexAttr) : -1;

    const paginationArr = this.makeArrPerPage();

    if (!value) return;

    if (value === '...') {
      const total = this.count;
      const midIndex = paginationArr.length / 2;

      if (index < midIndex) {
        this.currentPage = Math.max(this.currentPage - 10, 1);
      } else {
        this.currentPage = Math.min(this.currentPage + 10, total);
      }
    } else {
      const pageNumber = Number(value);
      if (!isNaN(pageNumber)) {
        this.currentPage = pageNumber;
      }
    }

    this.pageEmmiter.emit(this.currentPage);
  }
}
