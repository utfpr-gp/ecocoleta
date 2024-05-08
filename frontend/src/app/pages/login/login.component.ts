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
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
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

  constructor(
    private router: Router,
    private loginService: LoginService,
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

  submit() {
    this.loginService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.toastService.success('Login feito com sucesso!'),
            this.router.navigate(['/user']);
        },
        error: (err: any) => {
          this.toastService.error(
            'Erro inesperado! Tente novamente mais tarde'
          );
          // Se desejar, você pode lidar com o erro aqui também.
          console.error('Erro durante o login:', err);
        },
      });
  }

  navigate() {
    this.router.navigate(['register']);
  }
}
