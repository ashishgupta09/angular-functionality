import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = () => {
  const router = Inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true
  } else {
    router.naviagate(['/crud']);
    return false
  }
}
