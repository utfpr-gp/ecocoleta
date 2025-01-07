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

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        // Verifica se o token é inválido
        if (localStorage.getItem('token') === 'undefined' || this.auth.isAccessTokenInvalido()) {
            localStorage.setItem('redirectUrl', state.url); // Salva a URL original
            this.router.navigate(['/auth/login']);
            return of(false);
        }

        // Valida o usuário e redireciona conforme a role
        return this.userService.user$.pipe(
            take(1),
            map(user => {
                if (!user) {
                    this.router.navigate(['/auth/login']);
                    return false;
                }

                if (state.url === '/home') {
                    const roleRedirectMap = {
                        RESIDENT: '/home/resident',
                        WASTE_COLLECTOR: '/home/waste',
                        ADMIN: '/home/admin',
                    };

                    const redirectUrl = roleRedirectMap[user.role] || '/auth/access';
                    this.router.navigate([redirectUrl]);
                    return false;
                }

                if (next.data['role'] && next.data['role'] !== user.role) {
                    this.router.navigate(['/auth/access']);
                    return false;
                }

                return true;
            })
        );
    }
}
