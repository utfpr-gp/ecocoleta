import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {AuthenticateService} from "../authenticate.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";

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

    valCheck: string[] = ['remember'];
    loginForm!: FormGroup<LoginForm>;
    // password!: string;
    // salvarSenha!: boolean;

    constructor(public layoutService: LayoutService, private messageService: MessageService, public auth: AuthenticateService, private cookieService: CookieService) {
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
        console.log(this.loginForm.value);
        console.log("logando...");
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
            console.log("logando... form válido");
            this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
                .subscribe({
                    next: () => {
                        this.messageService.add({severity: 'success', summary: 'Login realizado com sucesso', life: 3000})
                        this.loginForm.reset();
                    },
                    error: (erro: any) => {
                        this.messageService.add({severity: 'error', summary: 'Erro ao realizar login', detail: erro?.error?.detail, life: 3000})
                    }
                });
        } else {
            this.messageService.add({severity: 'error', summary: 'Erro ao realizar login', detail: 'Preencha todos os campos', life: 3000})
        }
    }

    // login() {
    //     console.log(this.loginForm.value);
    //     console.log("logando...");
    //     if (this.loginForm.value.salvarSenha) {
    //         this.cookieService.set('salvarSenha', 'true');
    //         this.cookieService.set('usuarioSalvo', this.loginForm.value.email);
    //         this.cookieService.set('senhaSalva', this.loginForm.value.password);
    //     } else {
    //         this.cookieService.delete('salvarSenha');
    //         this.cookieService.delete('usuarioSalvo');
    //         this.cookieService.delete('senhaSalva');
    //     }
    //
    //     if (this.loginForm.valid) {
    //         console.log("logando... form válido");
    //
    //         this.auth.login(this.loginForm.value.email, this.loginForm.value.password)
    //             .catch((erro: any) => {
    //                 this.messageService.add({severity: 'error', summary: 'Erro ao realizar login', detail: erro?.error?.detail, life: 3000})
    //             });
    //     } else {
    //         this.messageService.add({severity: 'error', summary: 'Erro ao realizar login', detail: 'Preencha todos os campos', life: 3000})
    //     }
    // }
}
