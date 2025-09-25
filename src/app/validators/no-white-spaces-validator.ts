import { AbstractControl, ValidationErrors } from '@angular/forms';

export const noWhiteSpacesValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  if (typeof control.value === 'string' && control.value.trim().length === 0) {
    return { whitespace: true };
  }

  return null;
};
