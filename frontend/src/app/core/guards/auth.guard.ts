import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLogged()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

//TODO fazer authGuard como admin
// @Injectable()
// export class AdminGuard implements CanActivate {
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     return window.confirm('Você é um administrador?');
//   }
// }
