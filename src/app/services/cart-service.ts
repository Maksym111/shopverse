import { Injectable, OnInit } from '@angular/core';
import { CartProductInterf } from '../data/interfaces/cartProduct.interface';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../data/interfaces/products.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartProductInterf<Product>[] = [];

  private cartSubject = new BehaviorSubject<CartProductInterf<Product>[]>(
    this.cart
  );
  private totalPriceSubject = new BehaviorSubject<number>(0);

  cart$ = this.cartSubject.asObservable();
  totalPrice$ = this.totalPriceSubject.asObservable();

  constructor() {
    const getCartFromLocStor = localStorage.getItem('cart');
    if (getCartFromLocStor) {
      this.cart = JSON.parse(getCartFromLocStor);
      this.cartSubject.next(this.cart);
      this.totalPriceSubject.next(this.getTotalPrice());
    }
  }

  addToCart(product: Product, amount?: number) {
    const existProduct = this.cart.find(
      (elem) => elem.product.id === product.id
    );

    if (existProduct) {
      existProduct.quantity += amount || 1;
    } else {
      const cartProduct: CartProductInterf<Product> = {
        product,
        quantity: amount || 1,
      };
      this.cart.push(cartProduct);
    }

    this.cartSubject.next(this.cart);
    this.totalPriceSubject.next(this.getTotalPrice());
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  reduceAmount(id: number) {
    const existProduct = this.cart.find((elem) => elem.product.id === id);

    if (existProduct && existProduct.quantity > 1) {
      existProduct.quantity -= 1;
    } else {
      return;
    }

    this.cartSubject.next(this.cart);

    this.totalPriceSubject.next(this.getTotalPrice());
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeFromCart(id: number) {
    this.cart = this.cart.filter((elem) => elem.product.id !== id);
    this.cartSubject.next(this.cart);
    this.totalPriceSubject.next(this.getTotalPrice());
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getAllCartProducts() {
    return [...this.cart];
  }

  clearCart() {
    this.cart = [];
    this.cartSubject.next(this.cart);
    this.totalPriceSubject.next(0);
    localStorage.removeItem('cart');
  }

  getTotalPrice() {
    return this.cart.reduce(
      (acc, elem) => acc + elem.product.price * elem.quantity,
      0
    );
  }
}
