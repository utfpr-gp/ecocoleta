import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {LoginResponse} from "../../core/types/login-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

    apiUrl: string = `${environment.API}/auth`;
    jwtPayload: any;
    // TOKEN_KEY: string = 'token';

    constructor(private router: Router, private http: HttpClient, private jwtHelper: JwtHelperService) {
        this.carregarToken();
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http
            .post<LoginResponse>(this.apiUrl + '/login', { email, password })
            .pipe(
                tap((value) => {
                    if (value.token) {
                        //setando token no sessionStorage
                        this.armazenarToken(value.token);
                    }
                })
            );
    }

    logout(url) {
        this.limparAccessToken();
        this.router.navigate([url]);
    }

    isAccessTokenInvalido() {
        const token = localStorage.getItem('token');
        return !token || this.jwtHelper.isTokenExpired(token);
    }

    temPermissao(permissao: string) {
        // TODO verificar esse método de permissão
        return this.jwtPayload && (this.jwtPayload.authorities.includes(permissao) || this.jwtPayload.authorities.includes("administrador"));
    }

    temQualquerPermissao(roles: any) {
        // TODO verificar esse método de permissão
        for (const role of roles) {
            if (this.temPermissao(role)) {
                return true;
            }
        }
        return false;
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

    limparAccessToken() {
        localStorage.removeItem('token');
        this.jwtPayload = null;
    }
}
