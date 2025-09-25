import { AbstractControl, ValidationErrors } from '@angular/forms';

export const fullNameValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const isFullName = control.value?.trim().split(' ');
  return isFullName?.length > 1 ? null : { isFullname: 'incorrect full name' };
};
