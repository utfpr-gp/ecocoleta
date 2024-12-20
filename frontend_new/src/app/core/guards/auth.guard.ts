// import { inject } from '@angular/core';
// import { UserService } from '../services/user.service';
// import { Router } from '@angular/router';
//
// export const authGuard = () => {
//   const userService = inject(UserService);
//   const router = inject(Router);
//
//   if (userService.isLogged()) {
//     return true;
//   } else {
//     router.navigate(['/landing']);
//     return false;
//   }
// };

import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {
    }

    // canActivate(): boolean {
    //     // if (this.userService.isLogged()) {
    //     //     return true; // Usuário autenticado, acesso liberado
    //     // }
    //
    //     // Redireciona para 'landing' se não estiver autenticado
    //     this.router.navigate(['/landing']);
    //     return false;
    // }

    canActivate(): boolean {
        console.log('AuthGuard executado');
        this.router.navigate(['/landing']);
        return false;
    }

}
