import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { LoginDto, LoginResponse, RegisterDto, User } from '../models/auth.models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  /**
   * Login user and store token in localStorage
   * @param email User email
   * @param password User password
   * @returns Observable with login response
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`;
    const loginDto: LoginDto = { email, password };

    console.log('🔐 [AUTH SERVICE] Login initiated:', { email, url });

    return this.http.post<any>(url, loginDto).pipe(
      map((response: any) => {
        // Map API response to LoginResponse format
        // Adjust this based on actual API response structure
        const loginResponse: LoginResponse = {
          token: response.token || response.accessToken || response.jwtToken || '',
          user: response.user || {
            id: response.userId || response.id || '',
            email: email,
            fullName: response.fullName || response.name || email.split('@')[0]
          }
        };

        console.log('✅ [AUTH SERVICE] Login successful:', loginResponse);
        return loginResponse;
      }),
      tap(response => {
        console.log('💾 [AUTH SERVICE] Storing token and user data');
        this.setToken(response.token);
        this.setUser(response.user);
        console.log('✅ [AUTH SERVICE] Token stored:', this.getToken());
        console.log('✅ [AUTH SERVICE] User stored:', this.getUser());
      }),
      catchError(error => {
        console.error('❌ [AUTH SERVICE] Login failed:', error);
        return throwError(() => new Error(error.error?.message || 'Login failed. Please check your credentials.'));
      })
    );
  }

  /**
   * Register new user
   */
  register(registerDto: RegisterDto): Observable<any> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`;
    console.log('📝 [AUTH SERVICE] Register initiated:', registerDto);
    return this.http.post(url, registerDto).pipe(
      catchError(error => {
        console.error('❌ [AUTH SERVICE] Registration failed:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed.'));
      })
    );
  }

  /**
   * Logout user and clear storage
   */
  logout(): void {
    console.log('🚪 [AUTH SERVICE] Logging out user');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('✅ [AUTH SERVICE] Token and user data cleared');
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const authenticated = !!this.getToken();
    console.log('🔍 [AUTH SERVICE] Authentication check:', authenticated ? '✅ Authenticated' : '❌ Not authenticated');
    return authenticated;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Set token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get user data
   */
  getUser(): any {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set user data in localStorage
   */
  private setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}
