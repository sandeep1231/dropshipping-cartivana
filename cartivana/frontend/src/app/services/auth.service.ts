import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.API_URL}/login`, { email, password });
  }

  register(data: any) {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  getUser(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getToken() {
    return this.getUser()?.token;
  }

  logout() {
    localStorage.removeItem('user');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
