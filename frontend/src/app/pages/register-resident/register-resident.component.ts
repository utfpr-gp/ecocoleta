// import { Component } from '@angular/core';
// import {
//   FormControl,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
// import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
// import { ButtonLargerSecondaryComponent } from '../../components/button-larger-secondary/button-larger-secondary.component';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { RegisterUserService } from '../../services/register-user.service';
// // import { RegisterFormComponent } from '../../components/register-form/register-form.component';

// interface ResidentForm {
//   email: FormControl;
//   emailCheck: FormControl;
//   password: FormControl;
//   passwordCheck: FormControl;
//   userName: FormControl;
//   phoneNumber: FormControl;
// }

// @Component({
//   selector: 'app-register-resident',
//   standalone: true,
//   imports: [
//     // RegisterFormComponent,
//     ReactiveFormsModule,
//     PrimaryInputComponent,
//     ButtonLargerGreenComponent,
//     ButtonLargerSecondaryComponent,
//   ],
//   providers: [RegisterUserService],
//   templateUrl: './register-resident.component.html',
//   styleUrl: './register-resident.component.scss',
// })
// export class RegisterResidentComponent {
//   residentForm!: FormGroup<ResidentForm>;

//   constructor(
//     private router: Router,
//     private registerUserService: RegisterUserService,
//     private toastService: ToastrService
//   ) {
//     this.residentForm = new FormGroup({
//       email: new FormControl('', [Validators.required, Validators.email]),
//       emailCheck: new FormControl('', [Validators.required, Validators.email]),
//       password: new FormControl('', [
//         Validators.required,
//         Validators.minLength(5),
//       ]),
//       passwordCheck: new FormControl('', [
//         Validators.required,
//         Validators.minLength(5),
//       ]),
//       userName: new FormControl('', [Validators.required]),
//       phoneNumber: new FormControl('', [Validators.required]),
//     });
//   }

//   submit() {
//     this.registerUserService
//       .registerUserResident(
//         this.residentForm.value.userName,
//         this.residentForm.value.email,
//         this.residentForm.value.password,
//         this.residentForm.value.phoneNumber
//       )
//       .subscribe({
//         next: () => {
//           this.toastService.success('Cadastro feito com sucesso!'),
//             this.router.navigate(['/user']);
//         },
//         error: (err: any) => {
//           this.toastService.error(
//             'Erro inesperado! Tente novamente mais tarde'
//           );
//           // Se desejar, você pode lidar com o erro aqui também.
//           console.error('Erro durante o cadastro:', err);
//         },
//       });
//   }

//   navigateRegister() {
//     this.router.navigate(['register']);
//   }
// }
