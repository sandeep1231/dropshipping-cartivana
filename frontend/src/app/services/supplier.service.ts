import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/api-models';
import { OrderStats, ProductStats } from '../models/supplier-stats.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private API_URL = `${environment.apiUrl}/products`;
  private STATS_URL = `${environment.apiUrl}/supplier`;

  constructor(private http: HttpClient) {}

  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/mine`);
  }

  addProduct(product: Product) {
    return this.http.post(this.API_URL, product);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  getAllProducts(supplierId?: string): Observable<Product[]> {
    const url = supplierId
      ? `${this.API_URL}?supplier=${supplierId}`
      : this.API_URL;
    return this.http.get<Product[]>(url);
  }

  getPendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/pending`);
  }
  
  approveProduct(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}/approve`, {});
  }
  rejectProduct(id: string, reason: string): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}/reject`, { reason });
  }
  
  
  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, data);
  }
  toggleFeatured(id: string): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${id}/feature`, {});
  }
  
   /** 🔧 NEW: Supplier Stats */
   getProductStats(): Observable<ProductStats> {
    return this.http.get<ProductStats>(`${this.STATS_URL}/products/stats`);
  }
  
  getOrderStats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.STATS_URL}/orders/stats`);
  }
}
