import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { HomePage } from './pages/home-page/home-page';
import { ProductPage } from './pages/product-page/product-page';
import { ProductResolverService } from './services/product/product-resolve';
import { SearchPage } from './pages/search-page/search-page';
import { LoginPage } from './pages/login-page/login-page';
import { CartPage } from './pages/cart-page/cart-page';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomePage, data: { breadcrumb: 'Home' } },
      {
        path: 'product/:id',
        component: ProductPage,
        data: {
          breadcrumb: (data: any) => `${data.product.title}`,
        },
        resolve: { product: ProductResolverService },
      },
      { path: 'search', component: SearchPage, data: { breadcrumb: 'Search' } },
      { path: 'cart', component: CartPage, data: { breadcrumb: 'Cart' } },
      { path: 'login', component: LoginPage, data: { breadcrumb: 'Login' } },
    ],
  },
  { path: '**', redirectTo: '/' },
];
