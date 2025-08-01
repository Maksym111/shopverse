import { Component, inject } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Spinner } from '../spinner/spinner';
import { AsyncPipe, CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-layout',
  imports: [Header, RouterOutlet, Footer, Spinner, AsyncPipe, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  loadingService = inject(LoadingService);

  isLoading$ = this.loadingService.loading$;
}
