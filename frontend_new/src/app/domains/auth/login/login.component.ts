import {Component} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {MessageService} from "primeng/api";
import {AuthenticateService} from "../authenticate.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

interface LoginForm {
    email: FormControl;
    password: FormControl;
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
    password!: string;

    constructor(public layoutService: LayoutService, private messageService: MessageService, public auth: AuthenticateService) {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(5),
            ]),
        });
    }

    // login() {
    //     if (this.salvarSenha) {
    //         this.cookieService.set('salvarSenha', 'true');
    //         this.cookieService.set('usuarioSalvo', this.usuario);
    //         this.cookieService.set('senhaSalva', this.senha);
    //     } else {
    //         this.cookieService.delete('salvarSenha');
    //         this.cookieService.delete('usuarioSalvo');
    //         this.cookieService.delete('senhaSalva');
    //     }
    //
    //     this.auth.login(this.usuario, this.senha)
    //         .catch((erro: any) => {
    //             this.messageService.add({severity: 'error', summary: 'Erro ao realizar login', detail: erro['error']['detail'], life: 3000})
    //         });
    // }
}
