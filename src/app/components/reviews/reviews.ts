import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Review } from './review/review';
import { ReviewInterface } from '../../data/interfaces/review.interface';
import { IconSvg } from '../icon-svg/icon-svg';
import { Select } from '../select/select';
import { ModalService } from '../../services/modal-service';
import { FeedbackForm } from '../feedback-form/feedback-form';
import { AuthService } from '../../core/auth-service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-reviews',
  imports: [Review, IconSvg, Select, FeedbackForm, AsyncPipe],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Reviews implements OnInit {
  @Input() reviews: ReviewInterface[] = [];
  @Input() rating: number = 0;

  @ViewChild('modalTarget', { read: ViewContainerRef })
  viewContainerRef!: ViewContainerRef;

  modalService = inject(ModalService);
  authService = inject(AuthService);

  reviewsPerPage: ReviewInterface[] = [];

  isLoadMore = true;
  isLoggedIn!: Observable<boolean>;

  selectData = [
    { label: 'Ascending', value: 'ascending', selected: false },
    { label: 'Descending', value: 'descending', selected: true },
  ];

  ngOnInit(): void {
    this.addReviewsPerPage();
    this.sortReviewsBy();
    this.isLoggedIn = this.authService.isAuth$;
  }

  getSelectedNewData(value: string) {
    this.selectData = this.selectData.map((elem) => {
      elem.selected = false;
      if (elem.value === value) {
        elem.selected = true;
      }

      return elem;
    });

    this.sortReviewsBy(value);
  }

  addReviewsPerPage(prevCount: number = 0) {
    const remainingCount = this.reviews.length - this.reviewsPerPage.length;

    if (remainingCount > 3) {
      this.reviewsPerPage = [
        ...this.reviewsPerPage,
        ...this.reviews.slice(prevCount, prevCount + 3),
      ];
    } else {
      this.reviewsPerPage = [
        ...this.reviewsPerPage,
        ...this.reviews.slice(prevCount, prevCount + remainingCount),
      ];

      this.isLoadMore = false;
    }
  }

  loadMore() {
    this.addReviewsPerPage(this.reviewsPerPage.length);
  }

  sortReviewsBy(sort: string = 'descending') {
    switch (sort) {
      case 'ascending': {
        this.reviewsPerPage.sort(
          (current, next) => current.rating - next.rating
        );
        break;
      }

      case 'descending': {
        this.reviewsPerPage.sort(
          (current, next) => next.rating - current.rating
        );

        break;
      }

      default: {
        return this.reviewsPerPage;
      }
    }

    return this.reviewsPerPage;
  }

  openModal() {
    this.modalService
      .open(this.viewContainerRef, FeedbackForm)
      .subscribe((action) => {
        console.log('Action', action);
      });
  }
}
