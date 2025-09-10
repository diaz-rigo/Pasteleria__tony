import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
// import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  // Si no hay usuario o no es admin → redirigir al login
  if (!user || user.rol !== 'ADMIN') {
    router.navigate(['/login']);  // o la ruta que uses para login
    return false;
  }

  return true;
};
