import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if user has authentication token
  const authToken = localStorage.getItem('authToken');
  
  if (authToken) {
    // Redirect to dashboard if already authenticated
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};
