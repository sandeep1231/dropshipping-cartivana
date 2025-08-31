import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private API_URL = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(orderData: { products: { product: string; quantity: number }[]; totalAmount: number }) {
    return this.http.post<Order>(this.API_URL, orderData);
  }

  // New method for direct purchase without cart
  buyNow(productId: string, quantity: number, totalAmount: number): Observable<Order> {
    const orderData = {
      products: [{ product: productId, quantity }],
      totalAmount
    };
    return this.http.post<Order>(this.API_URL, orderData);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/mine`);
  }

  getMyOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/my-orders`);
  }
  
  getOrderByIdForUser(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${id}`);
  }
  
}
