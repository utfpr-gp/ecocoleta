import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {AuthenticateTokenService, LoginResponse} from "../authenticate-token.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {catchError, Observable, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {UserService} from "../../user/user.service";
import {Router} from "@angular/router";

interface LoginForm {
    email: FormControl;
    password: FormControl;
    salvarSenha: FormControl;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform: scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent {

    apiUrl: string = `${environment.API}/auth`;
    valCheck: string[] = ['remember'];
    loginForm!: FormGroup<LoginForm>;

    constructor(public layoutService: LayoutService,
                private messageService: MessageService,
                public auth: AuthenticateTokenService,
                private cookieService: CookieService,
                private http: HttpClient,
                private userService: UserService,
                private router: Router) {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(5),
            ]),
            salvarSenha: new FormControl(false)
        });
    }

    login() {
        if (this.loginForm.value.salvarSenha) {
            this.cookieService.set('salvarSenha', 'true');
            this.cookieService.set('usuarioSalvo', this.loginForm.value.email);
            this.cookieService.set('senhaSalva', this.loginForm.value.password);
        } else {
            this.cookieService.delete('salvarSenha');
            this.cookieService.delete('usuarioSalvo');
            this.cookieService.delete('senhaSalva');
        }

        if (this.loginForm.valid) {
            // Chama o método login diretamente dentro do componente
            this.loginApi(this.loginForm.value.email, this.loginForm.value.password)
                .subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Login realizado com sucesso',
                            life: 3000
                        });

                        // Redireciona para a URL de destino ou para a página inicial
                        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
                        localStorage.removeItem('redirectUrl');
                        this.router.navigate([redirectUrl]);

                        this.loginForm.reset();
                    },
                    error: (erro: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro ao realizar login',
                            detail: erro?.error?.detail,
                            life: 3000
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro ao realizar login',
                detail: 'Preencha todos os campos',
                life: 3000
            });
        }
    }

    // Método para chamar a API de login
    private loginApi(email: string, password: string): Observable<any> {
        return this.http
            .post<any>(this.apiUrl + '/login', {email, password})
            .pipe(
                tap((value) => {
                    if (value.token) {
                        //setando token no sessionStorage
                        this.auth.armazenarToken(value.token);

                        // Você pode chamar um método para atualizar o estado do usuário aqui, se necessário
                        this.userService.loadUserFromToken();
                    }
                }),
                catchError((error) => {
                    // Retorna um erro apropriado para o fluxo do observable
                    return throwError(() => new Error(error.error?.detail || 'Erro ao realizar login.'));
                })
            );
    }
}
