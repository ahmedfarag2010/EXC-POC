import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clone the request and add the Authorization header
    console.log('🔑 [AUTH INTERCEPTOR] Adding Authorization header to request:', req.url);
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.log('⚠️ [AUTH INTERCEPTOR] No token found, proceeding without Authorization header:', req.url);
  return next(req);
};
