import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
} from '@angular/core';
import { IconSvg } from '../icon-svg/icon-svg';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalContainer } from '../modal-container/modal-container';

@Component({
  selector: 'app-feedback-form',
  imports: [IconSvg, ReactiveFormsModule, NgClass],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackForm {
  @Input() modalContainer!: ModalContainer;
  @Input() submitEvent!: EventEmitter<void>;

  isFilled = false;

  fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    review: [''],
    rate: [null, Validators.required],
  });

  get email() {
    return this.form.get('email');
  }
  get fullName() {
    return this.form.get('fullName');
  }
  get rate() {
    return this.form.get('rate');
  }

  getCountStars(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  onStarClick(e: Event) {
    const input = e.target as HTMLInputElement;

    for (let i = 0; i < 5; i++) {
      input.parentNode?.parentNode?.children[i].classList.remove('colored');
    }

    input.parentNode?.parentNode?.children[
      5 - this.form.value.rate!
    ].classList.add('colored');

    this.isFilled = true;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      console.log(this.form);
      console.log(this.form.errors);
      return;
    }

    alert(
      `Form data submitted successfuly! ${JSON.stringify(this.form.value)}`
    );
    this.form.reset();
    this.isFilled = false;

    this.submitEvent.emit();
    this.modalContainer.close();
  }
}
