import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-select',
  imports: [NgClass],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {
  @Input() values: { label: string; value: string; selected: boolean }[] = [];

  @Output() selectedValue = new EventEmitter<string>();

  isOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (this.isOpen && !target.closest('.select')) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { label: string; value: string; selected: boolean }) {
    if (option.selected) {
      return;
    }

    let value = '';

    this.values = this.values.map((elem) => {
      if (elem.value === option.value) {
        elem.selected = true;
        value = elem.value;
      } else {
        elem.selected = false;
      }
      return elem;
    });

    this.selectedValue.emit(value);
  }
}
