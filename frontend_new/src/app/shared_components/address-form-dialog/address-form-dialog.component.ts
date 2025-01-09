import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PanelModule} from "primeng/panel";
import {MessageComponent} from "../message.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Address} from "../../core/types/address.type";
import {Router} from "@angular/router";
import {ViacepApiService} from "../../core/services/viacep-api.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-address-form-dialog',
  standalone: true,
    imports: [
        DialogModule,
        ProgressSpinnerModule,
        PanelModule,
        MessageComponent,
        ReactiveFormsModule
    ],
  templateUrl: './address-form-dialog.component.html',
  styleUrl: './address-form-dialog.component.scss'
})
export class AddressFormDialogComponent implements OnInit {
    @Input() address_id: string | undefined = undefined;
    @Input() addressFormDialog: boolean = false;
    @Output() outAddressFormDialog = new EventEmitter<boolean>();


    loading: boolean = false
    submitted: boolean = false;

    addressForm!: FormGroup;
    address: Address = {}; // Variável para armazenar a credencial



    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private viacepApiService: ViacepApiService
    ) {
    }

    ngOnInit(): void {
        this.configAddressForm();
    }

    showDialog(){
        if(this.address_id){
            this.loading = true;
            // Chama o serviço para pegar os dados do endereco
        }
    }

    hideDialog() {
        this.addressForm.reset();
        this.address_id = undefined;
        this.addressFormDialog = false;
        this.outAddressFormDialog.emit(false);
    }

    configAddressForm() {
        this.addressForm = this.formBuilder.group({
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
    }

    onCepChange(cep: string): void {

        console.log('CEP:', cep); // TODO remover após teste

        if (cep.length === 8) {
            this.viacepApiService.buscarCep(cep).subscribe({
                next: (dados) => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Buscando CEP!',
                        life: 1500,
                    });
                    if (dados.erro) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'CEP não encontrado!',
                            life: 3000,
                        });
                    } else {
                        this.addressForm.patchValue({
                            street: dados.logradouro,
                            neighborhood: dados.bairro,
                            city: dados.localidade,
                        });
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro ao buscar CEP',
                        detail: error?.message || 'Não foi possível buscar o CEP.',
                        life: 2000,
                    });
                    console.error('Erro ao buscar CEP:', error); // TODO remover após teste
                },
            });
        }
    }

    salvarEndereco() {
        this.submitted = true;
        if (this.addressForm.valid) {
            // Lógica para salvar o endereço
            this.messageService.add({
                severity: 'success',
                summary: 'Endereço salvo com sucesso',
                life: 3000
            });
            this.hideDialog();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, preencha os campos obrigatórios',
                life: 3000
            });
        }
    }

    // // Cria um novo usuário
    // private createUser(user: User) {
    //     if (!this.userType) {
    //         alert('Selecione o tipo de usuário antes de prosseguir.');
    //         return;
    //     }
    //
    //     // Adiciona o tipo de usuário ao objeto
    //     user.role = this.userType;
    //
    //     this.userService.createAndUpdateUser(user)
    //         .then(() => {
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Usuário criado com sucesso!',
    //                 life: 3000,
    //             });
    //         })
    //         .catch((err) => {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Erro ao criar usuário',
    //                 detail: err?.message,
    //                 life: 3000,
    //             });
    //         });
    //
    // }

}
