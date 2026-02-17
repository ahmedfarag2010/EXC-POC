import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ [AUTH GUARD] Checking access to route:', state.url);

  if (authService.isAuthenticated()) {
    console.log('✅ [AUTH GUARD] Access granted');
    return true;
  }

  // Redirect to login if not authenticated
  console.log('❌ [AUTH GUARD] Access denied, redirecting to login');
  router.navigate(['/login']);
  return false;
};
