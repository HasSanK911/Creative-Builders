import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

/**
 * There is one admin account and no roles, so being signed in is the whole check.
 *
 * (This used to also require a `menu` array in localStorage that nothing ever wrote,
 * which meant the guard could only ever fail — it was never attached to a route.)
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
