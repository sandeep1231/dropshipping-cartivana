import { CartItem } from './cart-item.model';

export interface Cart {
  _id: string;
  user: string; // or user object if needed
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  updatedAt?: string;
}
