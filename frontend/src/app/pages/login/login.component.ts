import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginDefaultComponent } from '../../components/login-default/login-default.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { ButtonLargerSecondaryComponent } from '../../components/button-larger-secondary/button-larger-secondary.component';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../core/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    LoginDefaultComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    ButtonLargerGreenComponent,
    ButtonLargerSecondaryComponent,
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  // Defina o objeto de mensagens de erro
  errorMessages: any = {
    email: {
      required: 'O campo E-mail é obrigatório.',
      email: 'Por favor, insira um e-mail válido.',
    },
    password: {
      required: 'O campo Senha é obrigatório.',
      minlength: 'A senha deve ter no mínimo 5 caracteres.',
    },
  };

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UserService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  runAction() {
    if (this.loginForm.invalid) {
      this.toastService.error('Por favor, corrija os erros no formulário.');
      // Mostrar mensagens de erro personalizadas para campos específicos
      this.showErrorMessage('email');
      this.showErrorMessage('password');
      return;
    }
    this.submit();
  }

  submit() {
    if (this.loginForm.valid) {
      this.loginService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (response) => {
            this.toastService.success('Login feito com sucesso!');
            // Atualiza o estado do usuário no UserService
            this.userService.setUserToken(response.token);
            this.router.navigate(['/user']);
            this.loginForm.reset();
          },
          error: (err) => {
            this.toastService.error(`'Erro durante o login: ${err?.message}`); // Se desejar, você pode lidar com o erro aqui também.
          },
        });
    }
  }

  showErrorMessage(field: string) {
    const formField = this.loginForm.get(field);
    if (formField?.errors) {
      const errors = Object.keys(formField.errors);
      const errorMessage = this.errorMessages[field][errors[0]];
      this.toastService.error(errorMessage);
    }
  }

  navigate() {
    this.router.navigate(['register']);
  }
}
