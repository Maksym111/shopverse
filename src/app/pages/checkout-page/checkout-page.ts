import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CartOrderSummary } from '../../components/cart-order-summary/cart-order-summary';
import { CheckoutForm } from '../../components/checkout-form/checkout-form';
import { map, Observable } from 'rxjs';
import { Product } from '../../data/interfaces/products.interface';
import { Store } from '@ngrx/store';
import { selectCart } from '../../app-state/selectors/cart.selectors';
import { ICartProduct } from '../../data/interfaces/cartProduct.interface';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  imports: [CartOrderSummary, CheckoutForm, AsyncPipe],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage implements OnInit {
  products!: Observable<ICartProduct<Product>[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.products = this.store
      .select(selectCart)
      .pipe(map((items) => items.slice(0, 5)));
  }

  onEdit() {
    this.router.navigate(['/cart']);
  }
}
