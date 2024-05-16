import { Component } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';
import { FormularyService } from '../../core/services/formulary.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/types/user.type';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UploadImgService } from '../../core/services/upload-img.service';
import { UserRole } from '../../core/types/user-role.type';

@Component({
  selector: 'app-register-waste-collector',
  standalone: true,
  imports: [FormBaseComponent],
  templateUrl: './register-waste-collector.component.html',
  styleUrl: './register-waste-collector.component.scss',
})
export class RegisterWasteCollectorComponent {
  formModeUpdate: boolean = false;
  userType: UserRole = UserRole.WASTE_COLLECTOR;

  constructor(
    private formularyService: FormularyService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
    private uploadService: UploadImgService
  ) {}

  async registerWasteCollector() {
    const formToRegister = this.formularyService.getRegister();
    if (formToRegister?.valid) {
      const newWasteCollector = formToRegister.getRawValue() as User;

      //TODO verificar fazer cadastramento mais robusto
      // Upload da imagem se presente
      if (newWasteCollector.picture) {
        try {
          const file: File = newWasteCollector.picture as File;
          const url = await this.uploadService.uploadImage(file);
          // this.toastrService.success('Imagem carregada com sucesso!');
          newWasteCollector.picture = url; // Atualiza o objeto com a URL da imagem
        } catch (error) {
          this.toastrService.error('Falha ao fazer upload da imagem.');
          console.error('Erro ao fazer upload da imagem:', error);
          return; // Interrompe o processo de registro se o upload falhar
        }
      }

      // Criação do usuário
      this.userService.createUserWasteCollector(newWasteCollector).subscribe({
        next: (value) => {
          this.router.navigate(['/user']);
          this.toastrService.success('Cadastro realizado com sucesso');
        },
        error: (err) => {
          this.toastrService.error('Erro ao realizar cadastro', err);
          console.error('Erro ao realizar cadastro', err);
        },
      });
    } else {
      this.toastrService.error('Por favor, corrija os erros no formulário.');
    }
  }
}
