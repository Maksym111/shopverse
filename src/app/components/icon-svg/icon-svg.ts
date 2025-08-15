import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'svg[icon]',
  imports: [],
  template: '<svg:use [attr.href]="href"></svg:use>',
  styleUrl: './icon-svg.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconSvg {
  @Input() icon = '';

  get href() {
    return `assets/images/${this.icon}.svg`;
  }
}
