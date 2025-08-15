import {
  DOCUMENT,
  EventEmitter,
  Inject,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { Subject } from 'rxjs';
import { ModalContainer } from '../components/modal-container/modal-container';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalNotifier?: Subject<string>;

  constructor(
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {}

  open<T extends { submitEvent: EventEmitter<void> }>(
    viewContainerRef: ViewContainerRef,
    content: Type<T> | TemplateRef<any>,
    options?: { size?: string; title?: string }
  ) {
    const modalComponent = viewContainerRef.createComponent(ModalContainer, {
      injector: this.injector,
    });

    const containerRef = modalComponent.instance.viewContainerRef;

    if (content instanceof TemplateRef) {
      const context = {
        submitEvent: modalComponent.instance.submitEvent,
      };

      containerRef.createEmbeddedView(content, context);
    } else {
      const childComponentRef = containerRef.createComponent<T>(content);

      if ('submitEvent' in childComponentRef.instance) {
        (childComponentRef.instance as any).submitEvent =
          modalComponent.instance.submitEvent;
        (childComponentRef.instance as any).modalContainer =
          modalComponent.instance;
      }
    }

    modalComponent.instance.title =
      options?.title ?? modalComponent.instance.title;

    modalComponent.instance.closeEvent.subscribe(() => {
      this.closeModal();
    });
    modalComponent.instance.submitEvent.subscribe(() => {
      this.submitModal();
    });

    modalComponent.hostView.detectChanges();

    this.document.body.appendChild(modalComponent.location.nativeElement);

    this.document.body.classList.add('overflow-hidden');

    this.modalNotifier = new Subject();

    return this.modalNotifier.asObservable();
  }

  closeModal() {
    this.modalNotifier?.complete();
    this.document.body.classList.remove('overflow-hidden');
  }

  submitModal() {
    this.modalNotifier?.next('confirm');
    this.closeModal();
  }
}
