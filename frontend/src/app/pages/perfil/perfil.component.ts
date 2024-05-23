import { Component, Input, OnInit } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';
import { UserService } from '../../core/services/user.service';
import { FormGroup } from '@angular/forms';
import { User } from '../../core/types/user.type';
import { FormularyService } from '../../core/services/formulary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormBaseComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  formModeUpdate: boolean = true;
  userId!: string | null;
  form!: FormGroup<any> | null;
  ReturnUserApi!: User;

  constructor(
    private userService: UserService,
    private formularyService: FormularyService,
    private router: Router,
    private paramsRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.paramsRoute.snapshot.paramMap.get('id');
    this.userService.getUser(this.userId).subscribe((user) => {
      this.ReturnUserApi = user;
      this.loadForm();
    });
  }

  loadForm() {
    console.log('vai carregar!!!!');
    this.form = this.formularyService.getRegister();
    console.log('form carregou ', this.form);
    this.form?.patchValue({
      id: this.ReturnUserApi?.id || this.userId,
      name: this.ReturnUserApi.name,
      email: this.ReturnUserApi.email,
      phone: this.ReturnUserApi.phone,
      cpf: this.ReturnUserApi?.cpf,
      cnpj: this.ReturnUserApi?.cnpj,
      picture: this.ReturnUserApi?.picture,
      role: this.ReturnUserApi.role,
    });
  }

  //TODO melhorar retorno da img como wasteCollecgtor,
  //TODO continuar a implementação do updateUser fazer switch case para cada tipo de user um body...
  updateUser() {
    let updatedUser: User = {} as User;
    console.log('this.returnapi', this.ReturnUserApi); //TODO apagar apos teste
    console.log('var obj ', updatedUser); //TODO apagar apos teste

    switch (this.ReturnUserApi.role) {
      case 'RESIDENT':
        updatedUser = {
          id: String(this.form?.value.id || this.userId),
          name: String(this.form?.value.name),
          email: String(this.form?.value.email),
          phone: Number(this.form?.value.phone),
        };
        break;
      case 'WASTE_COLLECTOR':
        updatedUser = {
          id: String(this.form?.value.id || this.userId),
          name: String(this.form?.value.name),
          email: String(this.form?.value.email),
          phone: Number(this.form?.value.phone),
          cpf: Number(this.form?.value.cpf),
          picture: String(this.form?.value.picture),
        };
        break;
      case 'COMPANY':
        updatedUser = {
          id: String(this.form?.value.id || this.userId),
          name: String(this.form?.value.name),
          email: String(this.form?.value.email),
          phone: Number(this.form?.value.phone),
          cnpj: Number(this.form?.value.cnpj),
        };
        break;
      case 'ADMIN':
        updatedUser = {
          id: String(this.form?.value.id || this.userId),
          name: String(this.form?.value.name),
          email: String(this.form?.value.email),
          phone: Number(this.form?.value.phone),
        };
        break;
    }

    console.log('updatedUser apos switch case', updatedUser); //TODO apagar apos teste
    // const updatedUser = this.form?.value;
    // updatedUser = {
    //   id: String(this.form?.value.id || this.userId),
    //   name: String(this.form?.value.name),
    //   email: String(this.form?.value.email),
    //   phone: Number(this.form?.value.phone),
    //   cpf: Number(this.form?.value.cpf),
    //   cnpj: Number(this.form?.value.cnpj),
    //   picture: String(this.form?.value.picture),
    //   // role: String(this.form?.value.role),
    // };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.toastrService.success('Usuário atualizado com sucesso!');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.log('erro', err);
        this.toastrService.error(`Erro ao atualizar usuário!: ${err?.message}`);
      },
    });
  }
}
