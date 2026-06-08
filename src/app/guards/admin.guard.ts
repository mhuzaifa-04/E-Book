import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 🟢 Verified Condition: Allow transition if token is present and role identity is Admin
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // ❌ Fallback: Silently bounce unauthorized requests straight back to the login gateway
  router.navigate(['/login']);
  return false;
};