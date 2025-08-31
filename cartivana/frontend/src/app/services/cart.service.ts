
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartQuantity$ = new BehaviorSubject<number>(0);

  getCartQuantityObservable() {
    return this.cartQuantity$.asObservable();
  }

  setCartQuantity(qty: number) {
    this.cartQuantity$.next(qty);
  }

  refreshCartQuantity() {
    this.getCart().subscribe(cart => {
      this.setCartQuantity(cart?.totalQuantity || 0);
    });
  }

    constructor(private http: HttpClient) {}
  cartKey = 'cartItems';
  private API_URL = `${environment.apiUrl}/cart`;

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.API_URL);
  }

  addToCart(productId: string, quantity: number): Observable<CartItem> {
    return this.http.post<CartItem>(this.API_URL, { productId, quantity });
  }

  updateCartItem(itemId: string, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${this.API_URL}/${itemId}`, { quantity });
  }

  removeCartItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${itemId}`);
  }

//   updateQuantity(id: string, qty: number) {
//     const cart = this.getCart().map((item: any) => {
//       if (item.id === id) item.quantity = qty;
//       return item;
//     });
//     localStorage.setItem(this.cartKey, JSON.stringify(cart));
//   }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    this.setCartQuantity(0);
  }
}
