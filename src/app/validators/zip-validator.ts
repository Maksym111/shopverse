import { AbstractControl, ValidationErrors } from '@angular/forms';

export const zipValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const regExp = /^[A-Za-z0-9\s-]+$/;
  return regExp.test(control.value)
    ? null
    : { inCorrectZip: 'incorrect zip code' };
};
