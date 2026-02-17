import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  /**
   * Login user and store token in localStorage
   * @param email User email
   * @param password User password
   * @returns Observable with login response
   */
  login(email: string, password: string): Observable<{ token: string; user: any }> {
    // TODO: Replace with actual API call
    // For now, simulate API response
    console.log('🔐 [AUTH SERVICE] Fake login initiated:', { email, password });
    
    const mockResponse = {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: 1,
        email: email,
        name: email.split('@')[0]
      }
    };

    console.log('✅ [AUTH SERVICE] Mock response generated:', mockResponse);

    return of(mockResponse).pipe(
      tap(response => {
        console.log('💾 [AUTH SERVICE] Storing token and user data');
        this.setToken(response.token);
        this.setUser(response.user);
        console.log('✅ [AUTH SERVICE] Token stored:', this.getToken());
        console.log('✅ [AUTH SERVICE] User stored:', this.getUser());
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
