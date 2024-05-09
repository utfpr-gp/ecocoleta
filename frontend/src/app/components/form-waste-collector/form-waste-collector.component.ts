import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { ButtonLargerSecondaryComponent } from '../../components/button-larger-secondary/button-larger-secondary.component';
import { Router } from '@angular/router';
import { LoginService } from '../../core/services/login.service';
import { ToastrService } from 'ngx-toastr';

interface WasteCollectorForm {
  email: FormControl;
  emailCheck: FormControl;
  password: FormControl;
  passwordCheck: FormControl;
  userName: FormControl;
  phoneNumber: FormControl;
}

@Component({
  selector: 'app-form-waste-collector',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimaryInputComponent,
    ButtonLargerGreenComponent,
    ButtonLargerSecondaryComponent,
  ],
  providers: [LoginService],
  templateUrl: './form-waste-collector.component.html',
  styleUrl: './form-waste-collector.component.scss',
})
export class FormWasteCollectorComponent {
  wasteCollectorForm!: FormGroup<WasteCollectorForm>;
  @Input() titlePage: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.wasteCollectorForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      emailCheck: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      passwordCheck: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
      ]),
    });
  }

  signup() {
    // Verifica se o formulário é válido
    if (this.wasteCollectorForm.valid) {
      // Verifica se os campos de email e senha correspondem
      if (
        this.wasteCollectorForm.value.email !==
        this.wasteCollectorForm.value.emailCheck
      ) {
        this.toastService.error('Os e-mails não correspondem');
        return;
      }
      if (
        this.wasteCollectorForm.value.password !==
        this.wasteCollectorForm.value.passwordCheck
      ) {
        this.toastService.error('As senhas não correspondem');
        return;
      }

      // Submete os dados do formulário
      this.loginService
        .signupWasteCollector(
          this.wasteCollectorForm.value.userName,
          this.wasteCollectorForm.value.email,
          this.wasteCollectorForm.value.password,
          this.wasteCollectorForm.value.phoneNumber
        )
        .subscribe({
          next: (response: any) => {
            const token = response.token;
            if (token) {
              this.toastService.success('Cadastro feito com sucesso!');

              //setando token no sessionStorage
              this.loginService.setToken(token);

              this.router.navigate(['/user']);
            } else {
              this.toastService.error('Token não recebido do servidor');
            }
          },
          // next: () => {
          //   this.toastService.success('Cadastro feito com sucesso!');
          //   this.router.navigate(['/user']);
          // },
          error: (err: any) => {
            this.toastService.error(
              `Erro durante o cadastro: ${err.error[0].message}` ||
                'Erro inesperado! Tente novamente mais tarde'
            );
            //TODO apagar console.log
            console.error('Erro durante o cadastro:', err);
          },
        });
    } else {
      console.log('Formulário inválido');

      this.toastService.error('Preencha todos os campos corretamente.');

      if (
        this.wasteCollectorForm.value.email !==
        this.wasteCollectorForm.value.emailCheck
      ) {
        this.toastService.error('Os e-mails não correspondem');
        return;
      }
      if (
        this.wasteCollectorForm.value.password !==
        this.wasteCollectorForm.value.passwordCheck
      ) {
        this.toastService.error('As senhas não correspondem');
        return;
      }

      // // Exibe mensagens de erro para os campos inválidos
      // Object.keys(this.wasteCollectorForm.controls).forEach((controlName) => {
      //   const control = this.wasteCollectorForm.get(controlName);
      //   if (control && control.invalid && (control.dirty || control.touched)) {
      //     const fieldName =
      //       controlName === 'emailCheck'
      //         ? 'Confirmação de E-mail'
      //         : controlName.charAt(0).toUpperCase() + controlName.slice(1);
      //     const errors = control.errors;
      //     let errorMessage = '';
      //     if (errors) {
      //       if (errors['required']) {
      //         errorMessage = `${fieldName} é obrigatório.`;
      //       } else if (errors['email']) {
      //         errorMessage = `${fieldName} deve ser um e-mail válido.`;
      //       } else if (errors['minlength']) {
      //         errorMessage = `${fieldName} deve ter no mínimo ${errors['minlength'].requiredLength} caracteres.`;
      //       } else if (errors['maxlength']) {
      //         errorMessage = `${fieldName} deve ter no máximo ${errors['maxlength'].requiredLength} caracteres.`;
      //       }
      //     }
      //     if (errorMessage !== '') {
      //       this.toastService.error(errorMessage);
      //     }
      //   }
      // });
    }
  }

  navigateRegister() {
    this.router.navigate(['register']);
  }
}
