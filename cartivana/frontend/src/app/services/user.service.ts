import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.API_URL}/me`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.API_URL}/me`, data);
  }
}
