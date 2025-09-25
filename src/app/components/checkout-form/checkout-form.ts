import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { zipValidator } from '../../validators/zip-validator';
import { fullNameValidator } from '../../validators/full-name-validator';
import { noWhiteSpacesValidator } from '../../validators/no-white-spaces-validator';

@Component({
  selector: 'app-checkout-form',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutForm {
  countriesSelect = [
    { value: 'uk', label: 'Ukraine' },
    { value: 'pl', label: 'Poland' },
    { value: 'fr', label: 'France' },
  ];

  fb = inject(FormBuilder);

  form = this.fb.group({
    email: [
      '',
      [Validators.email, Validators.required, noWhiteSpacesValidator],
    ],
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        fullNameValidator,
        noWhiteSpacesValidator,
      ],
    ],
    country: ['', [Validators.required, noWhiteSpacesValidator]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required, noWhiteSpacesValidator]],
    zip: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        zipValidator,
        noWhiteSpacesValidator,
      ],
    ],
    street: ['', [Validators.required, noWhiteSpacesValidator]],
    comments: [''],
    terms: [false, [Validators.requiredTrue]],
  });

  get email() {
    return this.form.get('email');
  }

  get fullName() {
    return this.form.get('fullName');
  }

  get country() {
    return this.form.get('country');
  }
  get state() {
    return this.form.get('state');
  }

  get city() {
    return this.form.get('city');
  }

  get zip() {
    return this.form.get('zip');
  }

  get street() {
    return this.form.get('street');
  }

  get terms() {
    return this.form.get('terms');
  }

  isRequired(control: AbstractControl) {
    return control.hasValidator(Validators.required);
  }

  isError(control: AbstractControl) {
    if (control.invalid && control.touched && control.dirty) {
      if (control.errors?.['required']) {
        return 'This field is required';
      }

      if (control.errors?.['minlength']) {
        return `Value should be more than ${control.errors?.['minlength'].requiredLength} symbols`;
      }

      if (control.errors?.['maxlength']) {
        return `Value should be less than ${control.errors?.['maxlength'].requiredLength} symbols`;
      }

      if (control.errors?.['isFullname']) {
        return 'Write correct full name';
      }

      if (control.errors?.['inCorrectZip']) {
        return 'Write correct zip code';
      }

      if (control.errors?.['whitespace']) {
        return 'Write no empty value';
      }

      return 'Write correct value';
    }
    return '';
  }

  onSubmit() {
    this.form.markAllAsDirty();
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    alert(JSON.stringify(this.form.value));
    this.form.reset();
  }
}
