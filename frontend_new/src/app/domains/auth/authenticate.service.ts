import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {catchError, firstValueFrom, Observable, tap, throwError} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";

export type LoginResponse = {
    token: string;
};

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {

    apiUrl: string = `${environment.API}/auth`;
    jwtPayload: any;

    constructor(private router: Router, private http: HttpClient, private jwtHelper: JwtHelperService) {
        this.carregarToken();
    }

    login(email: string, password: string): Observable<LoginResponse> {
        console.log('iniciando req login : email', email);
        console.log('API URL:', this.apiUrl + '/login'); // Check the URL
        return this.http
            .post<LoginResponse>(this.apiUrl + '/login', {email, password})
            .pipe(
                tap((value) => {
                    if (value.token) {
                        //setando token no sessionStorage
                        this.armazenarToken(value.token);
                        // TODO verificar  a role do user para redirecionar correto ?
                        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
                        localStorage.removeItem('redirectUrl');
                        this.router.navigate([redirectUrl]);
                        // return value;
                    }
                }),
                catchError((error) => {
                    // Retorna um erro apropriado para o fluxo do observable
                    return throwError(() => new Error(error.error?.detail || 'Erro ao realizar login.'));
                })
            );
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

    // temPermissao(permissao: string) {
    //     // TODO verificar esse método de permissão
    //     return this.jwtPayload && (this.jwtPayload.authorities.includes(permissao) || this.jwtPayload.authorities.includes("administrador"));
    // }

    // temQualquerPermissao(roles: any) {
    //     // TODO verificar esse método de permissão
    //     for (const role of roles) {
    //         if (this.temPermissao(role)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

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

    // existsToken() {
    //     return !!this.getToken();
    //     //Se o valor for null, undefined, 0, NaN, "" (string vazia) ou false, o resultado será false. Caso contrário, o resultado será true.
    // }
}
