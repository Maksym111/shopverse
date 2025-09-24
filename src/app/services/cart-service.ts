import { Injectable } from '@angular/core';
import { ICartProduct } from '../data/interfaces/cartProduct.interface';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../data/interfaces/products.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: ICartProduct<Product>[] = [];

  private cartSubject = new BehaviorSubject<ICartProduct<Product>[]>(this.cart);
  private totalPriceSubject = new BehaviorSubject<number>(0);
  private totalAmountProductsSubject = new BehaviorSubject<number>(0);

  cart$ = this.cartSubject.asObservable();
  totalPrice$ = this.totalPriceSubject.asObservable();
  totalAmountProducts$ = this.totalAmountProductsSubject.asObservable();

  constructor() {
    const getCartFromLocStor = localStorage.getItem('cart');
    if (getCartFromLocStor) {
      this.cart = JSON.parse(getCartFromLocStor);
      this.updateSubjects();
    }
  }

  updateSubjects() {
    this.cartSubject.next(this.cart);
    this.totalPriceSubject.next(this.getTotalPrice());
    this.totalAmountProductsSubject.next(this.getTotalAmountProducts());
  }

  addToCart(product: Product, amount?: number) {
    const existProduct = this.cart.find(
      (elem) => elem.product.id === product.id
    );

    if (existProduct) {
      existProduct.quantity += amount || 1;
    } else {
      const cartProduct: ICartProduct<Product> = {
        product,
        quantity: amount || 1,
      };
      this.cart.push(cartProduct);
    }

    this.updateSubjects();
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  reduceAmount(id: number) {
    const existProduct = this.cart.find((elem) => elem.product.id === id);

    if (existProduct && existProduct.quantity > 1) {
      existProduct.quantity -= 1;
    } else {
      return;
    }

    this.updateSubjects();
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeFromCart(id: number) {
    this.cart = this.cart.filter((elem) => elem.product.id !== id);
    this.updateSubjects();
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getAllCartProducts() {
    return [...this.cart];
  }

  clearCart() {
    this.cart = [];
    this.updateSubjects();
    localStorage.removeItem('cart');
  }

  getTotalPrice() {
    return this.cart.reduce(
      (acc, elem) => acc + elem.product.price * elem.quantity,
      0
    );
  }

  getTotalAmountProducts() {
    return this.cart.reduce((acc, item) => acc + item.quantity, 0);
  }
}
