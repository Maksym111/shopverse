import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appFavorite]',
})
export class Favorite implements OnChanges {
  @Input('appFavorite') isFavorite!: boolean | null;

  @HostBinding('class.filled') filled: boolean = false;

  ngOnChanges(): void {
    this.filled = !!this.isFavorite;
  }
}
