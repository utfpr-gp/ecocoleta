import { Component } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';
import { FormularyService } from '../../core/services/formulary.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/types/user.type';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRole } from '../../core/types/user-role.type';

@Component({
  selector: 'app-register-resident',
  standalone: true,
  imports: [FormBaseComponent],
  templateUrl: './register-resident.component.html',
  styleUrl: './register-resident.component.scss',
})
export class RegisterResidentComponent {
  //se formulario esta para edição ou cadastro, false=cadastro, true=edicao
  formModeUpdate: boolean = false;
  userType: UserRole = UserRole.RESIDENT;

  constructor(
    private formularyService: FormularyService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  registerResident() {
    const formToRegister = this.formularyService.getRegister();
    if (formToRegister?.valid) {
      const newResident = formToRegister.getRawValue() as User;

      this.userService.createUserResident(newResident).subscribe({
        next: (value) => {
          //   console.log('Cadastro realizado com sucesso', value);
          this.router.navigate(['/user']);
        },
        error: (err) => {
          // console.log('Erro ao realizar cadastro', err);
          this.toastrService.error('Erro ao realizar cadastro', err);
        },
      });
    }
  }
}
