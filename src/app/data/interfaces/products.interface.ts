import { ReviewInterface } from './review.interface';

export interface Products {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {};
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ReviewInterface[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {};
  thumbnail: string;
  images: string[];
}
