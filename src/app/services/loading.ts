import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);

  loading$ = this.loading.asObservable();

  show() {
    setTimeout(() => {
      this.loading.next(true);
    });
  }

  hide() {
    this.loading.next(false);
  }
}
