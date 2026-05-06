import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem('lao_auto_token')) return true;
  router.navigateByUrl('/');
  return false;
};

