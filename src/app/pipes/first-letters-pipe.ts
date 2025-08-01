import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetters',
})
export class FirstLettersPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .split(' ')
      .map((word) => word[0])
      .join('');
  }
}
