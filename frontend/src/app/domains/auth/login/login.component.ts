import {Component, AfterViewInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {AuthenticateTokenService} from "../authenticate-token.service";
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
export class LoginComponent implements AfterViewInit {

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

    ngAfterViewInit() {
        // Garante que a mensagem seja exibida após o componente estar renderizado
        setTimeout(() => {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'O login pode demorar até 2 minutos devido ao uso de servidor de produção gratuito.',
                life: 30000  // Exibe a mensagem por 30 segundos
            });
        }, 0);  // Executa após o ciclo de renderização
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
            this.loginApi(this.loginForm.value.email, this.loginForm.value.password)
                .subscribe({
                    next: () => {
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
                    error: (error: any) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro ao realizar login',
                            detail:  error?.message || 'Não foi possível realizar login.',
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

    // API de login
    private loginApi(email: string, password: string): Observable<any> {
        return this.http
            .post<any>(this.apiUrl + '/login', {email, password})
            .pipe(
                tap((value) => {
                    if (value.token) {
                        //setando token no sessionStorage
                        this.auth.armazenarToken(value.token);

                        //atualizar o estado do usuário
                        this.userService.loadUserFromToken();
                    }
                }),
                catchError((error) => {
                    // Retorna um erro apropriado para o fluxo do observable
                    return throwError(() => new Error(error.error?.message || 'Erro ao realizar login.'));
                })
            );
    }
}
