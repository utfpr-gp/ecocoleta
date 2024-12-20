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
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { UserService } from '../services/user.service';
//
// @Injectable({
//     providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//     constructor(private userService: UserService, private router: Router) {}
//
//     // canActivate(): boolean {
//     //     // const isLoggedIn = this.userService.isLogged();
//     //     const isLoggedIn = false;
//     //     console.log('AuthGuard isLoggedIn: ', isLoggedIn);
//     //
//     //
//     //     if (!isLoggedIn) {
//     //         this.router.navigate(['/landing']);
//     //         console.warn('Access denied - Redirecting to landing');
//     //     }
//     //
//     //     return isLoggedIn;
//     // }
//     canActivate(): boolean {
//         const isLoggedIn = false; // Ou use this.userService.isLogged()
//         console.log('AuthGuard isLoggedIn: ', isLoggedIn);
//
//         if (!isLoggedIn) {
//             console.log('Redirecionando para /landing');
//             this.router.navigate(['/landing']).then(() => {
//                 console.log('Redirecionamento concluído');
//             }).catch(err => {
//                 console.error('Erro ao redirecionar:', err);
//             });
//             return false;
//         }
//
//         console.log('Acesso permitido à rota /home');
//         return true;
//     }
//
//     //TODO continuar a implementação do guard
//
//
// }


import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
// import {AuthService} from './auth.service';
import {UserService} from "../services/user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        // private auth: AuthService,
        private userService: UserService,
        private router: Router
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isLoggedIn = this.userService.isLogged();

        console.log('AuthGuard isLoggedIn: ', isLoggedIn);

        if (!isLoggedIn) {
            console.log('Redirecionando para /landing');
            this.router.navigate(['/landing']).then(() => {
                console.log('Redirecionamento concluído');
            }).catch(err => {
                console.error('Erro ao redirecionar:', err);
            });
            return false;
        } else {
            console.log('Acesso permitido à rota /home');
            return true;
        }


        // if (localStorage.getItem('token') === 'undefined' || this.auth.isAccessTokenInvalido()) {
        //     localStorage.setItem('redirectUrl', state.url); // Salva a URL original
        //     this.router.navigate(['/login']);
        //     return false;
        // } else if (next.data['roles'] && !this.auth.temQualquerPermissao(next.data['roles'])) {
        //     this.router.navigate(['/access']);
        //     return false;
        // }
        // return true;
    }
}
