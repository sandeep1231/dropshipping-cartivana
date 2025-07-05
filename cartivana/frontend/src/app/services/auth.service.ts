import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/api-models';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, { email, password });
  }

  register(data: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, data);
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  getUser(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getToken(): string | undefined {
    return this.getUser()?.token;
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
