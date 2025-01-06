import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticateTokenService} from '../../domains/auth/authenticate-token.service';
import {UserService} from "../../domains/user/user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthenticateTokenService,
        private userService: UserService,
        private router: Router
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (localStorage.getItem('token') === 'undefined' || this.auth.isAccessTokenInvalido()) {
            localStorage.setItem('redirectUrl', state.url); // Salva a URL original
            this.router.navigate(['/auth/login']);
            return false;
        }
        // TODO fazer um service state de user para verificar se o user esta logado...
        // Verificar role do usuário
        const userRole = this.userService.getUserRole(); // Obtém a role do usuário

        if (state.url === '/home') {
            if (userRole === 'RESIDENT') {
                this.router.navigate(['/home/resident']);
            } else if (userRole === 'WASTE_COLLECTOR') {
                this.router.navigate(['/home/waste']);
            } else {
                this.router.navigate(['/auth/access']); // Redireciona se a role for inválida
            }
            return false; // Bloqueia a navegação direta para `/home`
        }

        // Verificar permissões se a rota exigir um role específico
        // if (next.data['role'] && next.data['role'] !== userRole) {
        //     this.router.navigate(['/auth/access']); // Redireciona para uma página de acesso negado
        //     return false;
        // }
        //
        // return true;

        else if (next.data['role'] && !this.userService.getUserRole()) {
            // TODO verificar esse else se esta ok com o retorno do back para permisoes?
            this.router.navigate(['/auth/access']);
            return false;
        }
        return true;
    }
}
