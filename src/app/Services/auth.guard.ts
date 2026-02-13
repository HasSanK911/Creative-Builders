import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    router.navigate(['']);
    return false;
  }
  const permittedRoutes = JSON.parse(localStorage.getItem('menu') || '[]');
  
  if (!permittedRoutes || permittedRoutes.length === 0) {
    router.navigate(['']).then(() => {
      setTimeout(() => {
        console.log('No menu permissions available');
      }, 500);
    });
    return false;
  }
  const urlPath = state.url.startsWith('/') ? state.url.slice(1) : state.url;
  const isPermitted = permittedRoutes.some((r: any) => {
    const cleanedUrl = urlPath.split('?')[0];
    return cleanedUrl.startsWith(r.route);
  });
  if (!isPermitted) {
    router.navigate(['/']);
    return false;
  }
  return true;
};