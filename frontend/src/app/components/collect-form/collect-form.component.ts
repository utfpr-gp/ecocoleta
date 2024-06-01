import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../core/types/user-role.type';
import { Router, RouterLink } from '@angular/router';
import { FormularyService } from '../../core/services/formulary.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-collect-form',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    ButtonLargerGreenComponent,
    PrimaryInputComponent,
  ],
  templateUrl: './collect-form.component.html',
  styleUrl: './collect-form.component.scss',
})
export class CollectFormComponent {
  formCollect!: FormGroup;
  @Input() titleBtn: string = 'Solicitar';
  @Input() formModeUpdate: boolean = false; //se editar ou cadastrar
  @Output() actionButtonClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() userRole: UserRole = UserRole.RESIDENT;
  // Variável para armazenar a URL local da imagem para exibição
  imagePreview: string | ArrayBuffer | null = null;

  // Defina o objeto de mensagens de erro
  errorMessages: any = {
    name: {
      required: 'O campo Nome e sobrenome é obrigatório.',
      minlength: 'O nome deve ter no mínimo 3 caracteres.',
      maxlength: 'O nome deve ter no máximo 250 caracteres.',
    },
    phone: {
      required: 'O campo Telefone é obrigatório.',
      minlength: 'O telefone deve ter no mínimo 11 caracteres.',
    },
    cnpj: {
      required: 'O campo CNPJ é obrigatório.',
      minlength: 'O CNPJ deve ter no mínimo 11 caracteres.',
    },
    cpf: {
      required: 'O campo CPF é obrigatório.',
      minlength: 'O CPF deve ter no mínimo 11 caracteres.',
    },
    picture: {
      required: 'Insira uma foto sua é obrigatório.',
      minlength: 'foto...',
    },
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formularyService: FormularyService,
    private toastrService: ToastrService,
    private userService: UserService
  ) {
    this.userRole = this.userService.userRole; // se user logado pega o role dele, ou do componente pai, caso não default é resident
  }

  ngOnInit() {
    console.log('log1 form  base user:', this.formCollect);

    this.formCollect = this.formBuilder.group({
      // name: new FormControl('', [
      //   Validators.required,
      //   Validators.minLength(3),
      //   Validators.maxLength(250),
      // ]),
      amount: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
      ]),
      // cpf: new FormControl(
      //   '',
      //   this.userRole === 'WASTE_COLLECTOR'
      //     ? [Validators.required, Validators.minLength(11)]
      //     : []
      // ),
      // cnpj: new FormControl(
      //   '',
      //   this.userRole === 'COMPANY'
      //     ? [Validators.required, Validators.minLength(11)]
      //     : []
      // ),
      // picture: new FormControl(
      //   '',
      //   this.userRole === 'WASTE_COLLECTOR' ? [Validators.required] : []
      // ),
    });
    console.log('log 2 form  base user:', this.formCollect);

    this.formularyService.setRegister(this.formCollect);

    console.log('log 3 form  base user:', this.formCollect);
  }

  handleFileInput(files: FileList | null): void {
    // console.log('chamou metodo handlefilesinput: files: ', files);

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Atribui o resultado do FileReader (data URL) à variável imagePreview
        this.imagePreview = e.target ? e.target.result : null;

        // Armazena o arquivo no formulário, mas ainda não faz o upload
        this.formCollect.patchValue({
          picture: file, // Aqui estamos passando o arquivo diretamente, não a URL
        });
      };

      reader.readAsDataURL(file);
    }
  }

  // Método para exibir o toast alert com as mensagens de erro personalizadas
  showErrorMessage(field: string) {
    const formField = this.formCollect.get(field);
    if (formField?.errors) {
      const errors = Object.keys(formField.errors);
      const errorMessage = this.errorMessages[field][errors[0]];
      this.toastrService.error(errorMessage);
    }
  }

  runAction() {
    if (this.formCollect.invalid) {
      this.toastrService.error('Por favor, corrija os erros no formulário.');
      // Mostrar mensagens de erro personalizadas para campos específicos
      this.showErrorMessage('email');
      this.showErrorMessage('emailCheck');
      this.showErrorMessage('password');
      this.showErrorMessage('passwordCheck');
      this.showErrorMessage('name');
      this.showErrorMessage('phone');
      this.showErrorMessage('cpf');
      this.showErrorMessage('picture');
      return;
    }
    this.actionButtonClick.emit();
  }
}
