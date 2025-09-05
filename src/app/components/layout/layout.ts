import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Spinner } from '../spinner/spinner';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../services/loading-service';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterOutlet, Footer, Spinner, AsyncPipe],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  loadingService = inject(LoadingService);

  isLoading$ = this.loadingService.loading$;
}
