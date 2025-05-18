import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private API_URL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  getFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/featured`);
  }
  
}
