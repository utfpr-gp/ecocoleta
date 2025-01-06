import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {catchError, firstValueFrom, Observable, tap, throwError} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserService} from "../user/user.service";

export type LoginResponse = {
    token: string;
};

@Injectable({
    providedIn: 'root'
})
export class AuthenticateTokenService {

    // apiUrl: string = `${environment.API}/auth`;
    jwtPayload: any;

    constructor(private router: Router,
                // private http: HttpClient,
                private jwtHelper: JwtHelperService,
                // private userService: UserService
    ) {
        this.carregarToken();
    }
    // TODO apagar esse metodo
    // login(email: string, password: string): Observable<LoginResponse> {
    //     return this.http
    //         .post<LoginResponse>(this.apiUrl + '/login', {email, password})
    //         .pipe(
    //             tap((value) => {
    //                 if (value.token) {
    //
    //                     //setando token no sessionStorage
    //                     this.armazenarToken(value.token);
    //                     //TODO fazer um service state de user para verificar se o user esta logado...
    //                     // ativa esse estate apos fazer autenticação assim o guard pode verificar se o user esta logado
    //                     // this.userService.loadUserFromToken(); // Atualiza o estado global
    //                     //***TODO precisa arrumar  o erro de redundancia entre userService e authservice...
    //                     // POSSOVEL SOLUÇÃO MOVER O METODO DE LOGIN NO COMPONENTE DE LOGI NLA CHAMO O SERVICE AUTHSERVICE PARA ARMAZENAR TOKEN, ETC E USERsERVICE PARA INSCREVER O USUARIO... ASSIM NÃO FICA REDUNDANTE
    //
    //
    //
    //                     const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
    //                     localStorage.removeItem('redirectUrl');
    //                     this.router.navigate([redirectUrl]);
    //                     // return value;
    //                 }
    //             }),
    //             catchError((error) => {
    //                 // Retorna um erro apropriado para o fluxo do observable
    //                 return throwError(() => new Error(error.error?.detail || 'Erro ao realizar login.'));
    //             })
    //         );
    // }

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

    // existsToken() {
    //     return !!this.getToken();
    //     //Se o valor for null, undefined, 0, NaN, "" (string vazia) ou false, o resultado será false. Caso contrário, o resultado será true.
    // }
}
