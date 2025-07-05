import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User, Order, AdminStats } from '../models/api-models';

export interface OrderQueryParams {
  status?: string;
  userId?: string;
  [key: string]: string | undefined;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private http: HttpClient) {}
    private API_URL = `${environment.apiUrl}`;
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.API_URL}/admin/users`);
      }
      
      updateUserRole(id: string, role: string): Observable<User> {
        return this.http.patch<User>(`${this.API_URL}/admin/users/${id}/role`, { role });
      }
      getAdminStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.API_URL}/admin/stats`);
      }
      getAllOrders(params: OrderQueryParams = {}): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.API_URL}/admin/orders`, { params: params as Record<string, string> });
      }
      getOrderById(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.API_URL}/admin/orders/${id}`);
      }
      
      updateOrderStatus(id: string, status: string): Observable<Order> {
        return this.http.patch<Order>(`${this.API_URL}/admin/orders/${id}/status`, { status });
      }
            
}
