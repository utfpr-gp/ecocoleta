import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticateService} from '../../domains/auth/authenticate.service';
import {UserService} from "../../domains/user/user.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthenticateService,
        private userService: UserService,
        private router: Router
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (localStorage.getItem('token') === 'undefined' || this.auth.isAccessTokenInvalido()) {
            localStorage.setItem('redirectUrl', state.url); // Salva a URL original
            this.router.navigate(['/auth/login']);
            return false;
        } else if (next.data['role'] && !this.userService.getUserRole()) {
            // TODO verificar esse else se esta ok com o retorno do back para permisoes?
            this.router.navigate(['/auth/access']);
            return false;
        }
        return true;
    }
}
