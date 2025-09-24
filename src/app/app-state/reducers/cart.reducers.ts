import { createReducer, on } from '@ngrx/store';
import { IInitialCartReducer } from '../../data/interfaces/state/state.interface';
import { Product } from '../../data/interfaces/products.interface';
import {
  addToCart,
  reduceAmountCartProduct,
  removeFromCart,
} from '../actions/cart.actions';

const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

export const initialState: IInitialCartReducer<Product> = {
  cart: savedCart,
};

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, props) => {
    const { product, quantity } = props;

    const existProduct = state.cart.find(
      (item) => item.product.id === product.id
    );

    if (existProduct) {
      const udatedCart = state.cart.map((item) =>
        item.product.id === existProduct.product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );

      return {
        ...state,
        cart: udatedCart,
      };
    }

    return { cart: [...state.cart, { product, quantity }] };
  }),
  on(removeFromCart, (state, props) => {
    const product = state.cart.find(
      (item) => item.product.id === props.productId
    );

    if (product) {
      const updatedCart = state.cart.filter(
        (item) => item.product.id !== props.productId
      );
      return {
        ...state,
        cart: updatedCart,
      };
    }

    return state;
  }),
  on(reduceAmountCartProduct, (state, props) => {
    const updatedCart = state.cart.map((item) =>
      item.product.id === props.productId && item.quantity > 1
        ? { product: item.product, quantity: item.quantity - 1 }
        : item
    );

    return {
      ...state,
      cart: updatedCart,
    };
  })
);
