import { Component } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';
import { FormularyService } from '../../core/services/formulary.service';
import { UserService } from '../../core/services/user.service';

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
    private userService: UserService
  ) {}

  register() {
    const formAserCadastrado = this.formularyService.getRegister();
    console.log(
      'register, botão d componente formbase filho clicado e iniciando metodo do componente api para cadastrar, chamar service etc',
      formAserCadastrado
    );
  }

  // cadastrar() {
  //   const formCadastro = this.formularioService.getCadastro()
  //   if(formCadastro?.valid) {
  //     const novoCadastro = formCadastro.getRawValue() as PessoaUsuaria;
  //     console.log(novoCadastro)
  //     this.cadastroService.cadastrar(novoCadastro).subscribe({
  //       next: (value) => {
  //         console.log('Cadastro realizado com sucesso', value);
  //         this.router.navigate(['/login'])
  //       },
  //       error: (err) => {
  //         console.log('Erro ao realizar cadastro', err)
  //       }
  //     })
  //   }
  // }
}
