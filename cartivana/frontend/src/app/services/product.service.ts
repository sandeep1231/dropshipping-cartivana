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

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }

  // Search suggestions - lightweight API call for autocomplete
  getSearchSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/search/suggestions`, {
      params: { q: query, limit: '8' }
    });
  }

  // Full search with filters and sorting
  searchProducts(params: {
    query?: string;
    category?: string;
    categories?: string[]; // New: support for multiple categories
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Observable<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const searchParams: any = {};
    
    if (params.query) searchParams.q = params.query;
    
    // Support for multiple categories (preferred)
    if (params.categories && params.categories.length > 0) {
      // Send multiple categories as array
      params.categories.forEach((categoryId, index) => {
        searchParams[`categories[${index}]`] = categoryId;
      });
    }
    // Legacy single category support
    else if (params.category && params.category !== 'All') {
      searchParams.category = params.category;
    }
    
    if (params.minPrice) searchParams.minPrice = params.minPrice.toString();
    if (params.maxPrice) searchParams.maxPrice = params.maxPrice.toString();
    if (params.rating) searchParams.rating = params.rating.toString();
    if (params.sortBy) searchParams.sortBy = params.sortBy;
    if (params.page) searchParams.page = params.page.toString();
    if (params.limit) searchParams.limit = params.limit.toString();

    return this.http.get<{
      products: Product[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.API_URL}/search`, { params: searchParams });
  }

  createProduct(product: any) {
    return this.http.post(`${this.API_URL}`, product);
  }
}
