import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/api-models';

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
      getAdminStats(): Observable<any> {
        return this.http.get(`${this.API_URL}/admin/stats`);
      }
      getAllOrders(params: any = {}): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/admin/orders`, { params });
      }
      getOrderById(id: string): Observable<any> {
        return this.http.get(`${this.API_URL}/admin/orders/${id}`);
      }
      
      updateOrderStatus(id: string, status: string): Observable<any> {
        return this.http.patch(`${this.API_URL}/admin/orders/${id}/status`, { status });
      }
            
}
