import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import {
  RefreshTokenResponse,
  TokenResponse,
} from '../data/interfaces/tokenResponse.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApiUrl = 'https://dummyjson.com/auth';

  private http = inject(HttpClient);
  private cookie = inject(CookieService);
  private route = inject(Router);

  token: string | null = null;
  refreshToken: string | null = null;

  isAuth() {
    if (!this.token) {
      this.token = this.cookie.get('token');
      this.refreshToken = this.cookie.get('refreshToken');
    }
    return !!this.token;
  }

  login(data: Partial<{ login: string | null; password: string | null }>) {
    const resData = JSON.stringify(data);

    return this.http
      .post<TokenResponse>(`${this.baseApiUrl}/login`, resData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((response) => {
          this.saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        })
      );
  }

  saveTokens(item: RefreshTokenResponse) {
    this.token = item.accessToken;
    this.refreshToken = item.refreshToken;

    this.cookie.set('token', this.token);
    this.cookie.set('refreshToken', this.refreshToken);
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.cookie.deleteAll();
    this.route.createUrlTree(['/login']);
  }

  refreshAuthToken() {
    return this.http
      .post<RefreshTokenResponse>(`${this.baseApiUrl}/refresh`, {
        refreshToken: this.refreshToken,
      })
      .pipe(
        tap((res) => this.saveTokens(res)),
        catchError((err) => {
          this.logout();
          return throwError(err);
        })
      );
  }
}
