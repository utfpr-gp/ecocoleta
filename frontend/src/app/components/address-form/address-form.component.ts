import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonLargerGreenComponent } from '../button-larger-green/button-larger-green.component';
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRole } from '../../core/types/user-role.type';
import { Router } from '@angular/router';
import { FormularyService } from '../../core/services/formulary.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { FormValidations } from '../../core/utils/form-validation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonLargerGreenComponent,
    PrimaryInputComponent,
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent implements OnInit {
  formAddress!: FormGroup;
  @Input() titlePage: string = '';
  @Input() titleBtn: string = 'Cadastrar';
  @Input() formModeUpdate: boolean = false; //se editar ou cadastrar
  @Output() actionButtonClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() userRole: UserRole = UserRole.RESIDENT;

  // Defina o objeto de mensagens de erro
  errorMessages: any = {
    cep: {
      required: 'O campo Cep é obrigatório.',
      minlength: 'Por favor, insira um cep válido.',
      maxlength: 'O cep deve ter no máximo 250 caracteres.',
    },
    name: {
      required: 'O campo Nome é obrigatório.',
      minlength: 'Por favor, insira um Nome válido.',
      maxlength: 'O Nome deve ter no máximo 250 caracteres.',
    },
    street: {
      required: 'O campo Rua é obrigatório.',
      minlength: 'Por favor, insira uma Rua válida.',
      maxlength: 'A Rua deve ter no máximo 250 caracteres.',
    },
    number: {
      required: 'O campo Número é obrigatório.',
      minlength: 'Por favor, insira um Número válido.',
      maxlength: 'O Número deve ter no máximo 250 caracteres.',
    },
    neighborhood: {
      required: 'O campo Bairro é obrigatório.',
      minlength: 'Por favor, insira um Bairro válido.',
      maxlength: 'O Bairro deve ter no máximo 250 caracteres.',
    },
    city: {
      required: 'O campo Cidade é obrigatório.',
      minlength: 'Por favor, insira uma Cidade válida.',
      maxlength: 'A Cidade deve ter no máximo 250 caracteres.',
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
    this.formAddress = this.formBuilder.group({
      cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250),
      ]),
      street: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
      number: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      neighborhood: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(250),
      ]),
    });
    this.formularyService.setRegister(this.formAddress);
  }

  // Método para exibir o toast alert com as mensagens de erro personalizadas
  showErrorMessage(field: string) {
    const formField = this.formAddress.get(field);
    if (formField?.errors) {
      const errors = Object.keys(formField.errors);
      const errorMessage = this.errorMessages[field][errors[0]];
      this.toastrService.error(errorMessage);
    }
  }

  runAction() {
    if (this.formAddress.invalid) {
      this.toastrService.error('Por favor, corrija os erros no formulário.');
      // Mostrar mensagens de erro personalizadas para campos específicos
      this.showErrorMessage('cep');
      this.showErrorMessage('name');
      this.showErrorMessage('street');
      this.showErrorMessage('number');
      this.showErrorMessage('neighborhood');
      this.showErrorMessage('city');
      return;
    }
    this.actionButtonClick.emit();
  }

  navigate() {
    this.router.navigate(['/home']);
  }
}
