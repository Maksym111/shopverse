import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { HomePage } from './pages/home-page/home-page';
import { ProductPage } from './pages/product-page/product-page';
import { ProductResolverService } from './services/product/product-resolve';
import { ProductsPage } from './pages/products-page/products-page';
import { LoginPage } from './pages/login-page/login-page';
import { CartPage } from './pages/cart-page/cart-page';
import { canActivateAuth } from './core/guards/auth.guard';
import { CheckoutPage } from './pages/checkout-page/checkout-page';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomePage, data: { breadcrumb: 'Home' } },
      {
        path: 'products',
        component: ProductsPage,
        data: { breadcrumb: 'Products' },
      },
      {
        path: 'products/:id',
        component: ProductPage,
        data: {
          breadcrumb: (data: any) => `${data.product.title}`,
        },
        resolve: { product: ProductResolverService },
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorites-page/favorites-page').then(
            (c) => c.FavoritesPage
          ),
        data: { breadcrumb: 'Favorites' },
      },
      { path: 'cart', component: CartPage, data: { breadcrumb: 'Cart' } },
      {
        path: 'checkout',
        component: CheckoutPage,
        data: { breadcrumb: 'Checkout' },
      },
      {
        path: 'login',
        component: LoginPage,
        data: { breadcrumb: 'Login' },
      },
    ],
  },
  { path: '**', redirectTo: '/' },
];
