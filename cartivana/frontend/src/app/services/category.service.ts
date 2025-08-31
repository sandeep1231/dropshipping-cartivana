import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  displayOrder: number;
  productCount?: number;
  children?: Category[];
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private API_URL = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Get all active categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  // Get all categories (including inactive) for admin
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}?includeInactive=true`);
  }

  // Get category tree (hierarchical structure)
  getCategoryTree(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/tree`);
  }

  // Get categories with product counts
  getCategoriesWithCounts(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/with-counts`);
  }

  // Get all categories with product counts (including inactive) for admin
  getAllCategoriesWithCounts(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/with-counts?includeInactive=true`);
  }

  // Get category by ID or slug
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/${id}`);
  }

  // Admin methods
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.API_URL, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
