import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  @Input() values: { label: string; value: string; selected: boolean }[] = [];

  @Output() newData = new EventEmitter<
    {
      label: string;
      value: string;
      selected: boolean;
    }[]
  >();

  isOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;

    if (this.isOpen && !target.closest('.select')) {
      this.isOpen = false;
    }
  }

  toggleDropdown(e: Event) {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: { label: string; value: string; selected: boolean }) {
    if (option.selected) {
      return;
    }
    this.values = this.values.map((elem) => {
      if (elem.value === option.value) {
        elem.selected = true;
      } else {
        elem.selected = false;
      }
      return elem;
    });

    this.newData.emit(this.values);
  }
}
