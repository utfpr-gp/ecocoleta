import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of, take} from 'rxjs';
import {AuthenticateTokenService} from '../../domains/auth/authenticate-token.service';
import {UserService} from "../../domains/user/user.service";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private auth: AuthenticateTokenService,
        private userService: UserService,
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = localStorage.getItem('token');

        // Se o token está ausente ou inválido, redireciona para a rota apropriada
        if (!token || this.auth.isAccessTokenInvalido()) {
            if (state.url === '/') {
                return this.router.parseUrl('/landing');
            } else {
                localStorage.setItem('redirectUrl', state.url); // Salva a URL para redirecionamento pós-login
                return this.router.parseUrl('/auth/login');
            }
        }

        // Redireciona usuários autenticados para sua home ao acessar `/`
        if (state.url === '/') {
            const roleRedirectMap = {
                RESIDENT: '/home/resident',
                WASTE_COLLECTOR: '/home/waste',
                ADMIN: '/home/admin',
            };

            const userRole = this.userService.getUserRole();
            const redirectUrl = roleRedirectMap[userRole] || '/auth/access';
            return this.router.parseUrl(redirectUrl);
        }

        return true; // Permite acesso às rotas protegidas
    }

    // canActivate(
    //     next: ActivatedRouteSnapshot,
    //     state: RouterStateSnapshot
    // ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //     const token = localStorage.getItem('token');
    //
    //     // Se o token está ausente ou inválido, redireciona para login
    //     if (!token || this.auth.isAccessTokenInvalido()) {
    //         if (state.url === '/') {
    //             this.router.navigate(['/landing']);
    //         } else {
    //             localStorage.setItem('redirectUrl', state.url); // Salva a URL que o usuário tentou acessar
    //             this.router.navigate(['/auth/login']);
    //         }
    //         return false;
    //     }
    //
    //     // Se o usuário está autenticado e tenta acessar `/`, redireciona para sua home
    //     if (state.url === '/') {
    //         const roleRedirectMap = {
    //             RESIDENT: '/home/resident',
    //             WASTE_COLLECTOR: '/home/waste',
    //             ADMIN: '/home/admin',
    //         };
    //
    //         const userRole = this.userService.getUserRole();
    //         const redirectUrl = roleRedirectMap[userRole] || '/auth/access';
    //         this.router.navigate([redirectUrl]);
    //         return false;
    //     }
    //
    //     return true; // Permite acesso às outras rotas protegidas
    // }

    // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    //     // Verifica se o token é inválido
    //     if (localStorage.getItem('token') === 'undefined' || this.auth.isAccessTokenInvalido()) {
    //         localStorage.setItem('redirectUrl', state.url); // Salva a URL original
    //         this.router.navigate(['/auth/login']);
    //         return of(false);
    //     }
    //
    //     // Valida o usuário e redireciona conforme a role
    //     return this.userService.user$.pipe(
    //         take(1),
    //         map(user => {
    //             if (!user) {
    //                 this.router.navigate(['/auth/login']);
    //                 return false;
    //             }
    //
    //             if (state.url === '/home') {
    //                 const roleRedirectMap = {
    //                     RESIDENT: '/home/resident',
    //                     WASTE_COLLECTOR: '/home/waste',
    //                     ADMIN: '/home/admin',
    //                 };
    //
    //                 const redirectUrl = roleRedirectMap[user.role] || '/auth/access';
    //                 this.router.navigate([redirectUrl]);
    //                 return false;
    //             }
    //
    //             if (next.data['role'] && next.data['role'] !== user.role) {
    //                 this.router.navigate(['/auth/access']);
    //                 return false;
    //             }
    //
    //             return true;
    //         })
    //     );
    // }
}
