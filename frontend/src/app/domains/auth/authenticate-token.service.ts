import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

export type LoginResponse = {
    token: string;
};

@Injectable({
    providedIn: 'root'
})
export class AuthenticateTokenService {

    jwtPayload: any;

    constructor(private router: Router,
                private jwtHelper: JwtHelperService,
    ) {
        this.carregarToken();
    }

    logout() {
        this.limparToken();
        this.router.navigate(['/']);
    }

    isAccessTokenInvalido() {
        const token = localStorage.getItem('token');
        return !token || this.jwtHelper.isTokenExpired(token);
        this.limparToken();
    }

    isTokenValido(): boolean {
        const token = this.getToken();
        return token && !this.jwtHelper.isTokenExpired(token);
    }

    getJwtPayload(): any {
        return this.jwtPayload;
    }

    public armazenarToken(token: string) {
        this.jwtPayload = this.jwtHelper.decodeToken(token);

        localStorage.setItem('token', token);
    }

    public carregarToken() {
        const token = localStorage.getItem('token');
        if (token) {
            this.armazenarToken(token);
        }
    }

    limparToken() {
        localStorage.removeItem('token');
        this.jwtPayload = null;
    }

    getToken() {
        return localStorage.getItem('token') ?? '';
    }
}
