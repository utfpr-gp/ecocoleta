import { Component } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';
import { FormularyService } from '../../core/services/formulary.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/types/user.type';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-waste-collector',
  standalone: true,
  imports: [FormBaseComponent],
  templateUrl: './register-waste-collector.component.html',
  styleUrl: './register-waste-collector.component.scss',
})
export class RegisterWasteCollectorComponent {
  //se formulario esta para edição ou cadastro, false=cadastro, true=edicao
  formModeUpdate: boolean = false;
  constructor(
    private formularyService: FormularyService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  registerWasteCollector() {
    const formToRegister = this.formularyService.getRegister();
    if (formToRegister?.valid) {
      const newWasteCollector = formToRegister.getRawValue() as User;

      console.log('newWasteCollector picture: ', newWasteCollector.picture);
      // newWasteCollector.picture = 'https://teste/imgteste.png'; //TODO apagar apos teste

      // this.userService.createUserWasteCollector(newWasteCollector).subscribe({
      //   next: (value) => {
      //     // console.log('Cadastro realizado com sucesso', value);
      //     this.router.navigate(['/user']);
      //   },
      //   error: (err) => {
      //     // console.log('Erro ao realizar cadastro', err);
      //     this.toastrService.error('Erro ao realizar cadastro', err);
      //   },
      // });
    }
  }
  //TODO fazer metodo cadastro com tratamento de erros e toastr
}
