import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-modal-container',
  imports: [],
  templateUrl: './modal-container.html',
  styleUrl: './modal-container.scss',
})
export class ModalContainer {
  @Input() title = 'Write Review';

  @Output() closeEvent = new EventEmitter();
  @Output() submitEvent = new EventEmitter();

  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  viewContainerRef!: ViewContainerRef;

  constructor(private elementRef: ElementRef) {}

  close(): void {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }
}
