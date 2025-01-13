import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticateTokenService} from '../../domains/auth/authenticate-token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private auth: AuthenticateTokenService,
        private router: Router
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = localStorage.getItem('token');

        // Verifica se o token está ausente ou inválido
        if (!token || this.auth.isAccessTokenInvalido()) {
            if (state.url === '/') {
                return this.router.parseUrl('/landing'); // Redireciona para /landing se acessar a raiz
            } else {
                localStorage.setItem('redirectUrl', state.url); // Salva a URL para redirecionamento pós-login
                return this.router.parseUrl('/auth/login'); // Redireciona para /auth/login
            }
        }

        // Token válido: permite o acesso
        return true;
    }
}
