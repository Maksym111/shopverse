import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { HomePage } from './pages/home-page/home-page';
import { ProductPage } from './pages/product-page/product-page';
import { ProductResolverService } from './services/product-resolve';
import { SearchPage } from './pages/search-page/search-page';

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
    ],
  },
  { path: '**', redirectTo: '/' },
];
