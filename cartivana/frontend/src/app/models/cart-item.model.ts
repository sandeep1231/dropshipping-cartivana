import { Product } from './product.model';

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}
