import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReviewInterface } from '../../../data/interfaces/review.interface';
import { IconSvg } from '../../icon-svg/icon-svg';
import { DatePipe, NgClass } from '@angular/common';
import { FirstLettersPipe } from '../../../pipes/first-letters-pipe';

@Component({
  selector: 'app-review',
  imports: [IconSvg, DatePipe, NgClass, FirstLettersPipe],
  templateUrl: './review.html',
  styleUrl: './review.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Review {
  @Input() review: ReviewInterface | null = null;

  getCountStars(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }
}
