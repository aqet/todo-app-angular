import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  // debugger;
  const router = inject(Router);
  const authService = inject(AuthService);
console.log('isloged');
  const isloged = authService.isitlogged();
console.log('isloged');
  if (isloged != null && isloged != false) {
    return true;
  } else {
    router.navigateByUrl('/auth');
    return false;
  }
};
