import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/api-models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  updateProfile(data: { name: string; email: string; password?: string }) {
    return this.http.put<User>(`${this.API_URL}/me`, data);
  }
}
