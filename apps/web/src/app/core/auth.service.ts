import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './environment';
import { tap } from 'rxjs';

export interface AuthResponse {
  accessToken: string;
  user: {
    sub: string;
    email: string;
    role: string;
    tenantId?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(credentials: any) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.accessToken) {
          localStorage.setItem('lao_auto_token', res.accessToken);
          localStorage.setItem('lao_auto_user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('lao_auto_token');
    localStorage.removeItem('lao_auto_user');
  }

  getUser() {
    const userStr = localStorage.getItem('lao_auto_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
