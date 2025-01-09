import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PanelModule} from "primeng/panel";
import {MessageComponent} from "../message.component";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Address} from "../../core/types/address.type";
import {Router} from "@angular/router";
import {ViacepApiService} from "../../core/services/viacep-api.service";
import {MessageService} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {AddressService} from "./address.service";

@Component({
    selector: 'app-address-form-dialog',
    standalone: true,
    imports: [
        DialogModule,
        ProgressSpinnerModule,
        PanelModule,
        MessageComponent,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        RippleModule
    ],
    templateUrl: './address-form-dialog.component.html',
    styleUrl: './address-form-dialog.component.scss'
})
export class AddressFormDialogComponent implements OnInit {
    @Input() userId: string | null = null;
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
        private addressService: AddressService,
        private viacepApiService: ViacepApiService
    ) {
    }

    ngOnInit(): void {
        this.configAddressForm();

        console.log('form address - userId', this.userId); //TODO apagar apos teste
        console.log('form address - address_id', this.address_id); //TODO apagar apos teste
    }

    showDialog() {
        if (this.address_id) {

            console.log('form address - iniciando a busca endereço - address_id', this.address_id); //TODO apagar apos teste

            this.loading = true;
            this.addressService.getOneAddressByUserIdAndAddressId(this.userId, this.address_id).subscribe({
                next: (address) => {
                    this.addressForm.patchValue(address);
                    this.loading = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro ao carregar o endereço',
                        detail: error?.error?.message || 'Não foi possível carregar os dados do endereço.',
                        life: 3000,
                    });
                    console.error('Erro ao carregar endereço:', error); // TODO remover após teste
                    this.loading = false;
                },
            });
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
            cep: new FormControl('', [Validators.required, Validators.minLength(7)]),
            name: new FormControl('', [
                Validators.required,
                Validators.maxLength(250),
            ]),
            street: new FormControl('', [
                Validators.required,
                Validators.maxLength(250),
            ]),
            number: new FormControl('', [
                Validators.required,
                Validators.maxLength(250),
            ]),
            neighborhood: new FormControl('', [
                Validators.required,
                Validators.maxLength(250),
            ]),
            city: new FormControl('', [
                Validators.required,
                Validators.maxLength(250),
            ]),
            state: new FormControl('', [
                Validators.required,
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
                            state: dados.estado
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
    // TODO implementar - pegar longitute lat do user????

    salveAddress() {
        this.submitted = true;
        if (this.addressForm.valid) {
            const addressData: Address = this.addressForm.value;
            if (this.address_id) {
                // Atualizar endereço existente
                addressData.id = this.address_id;
                this.addressService.updateAddress(addressData).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Endereço atualizado com sucesso',
                            life: 3000,
                        });
                        this.hideDialog();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro ao atualizar endereço',
                            detail: error?.error?.message || 'Não foi possível atualizar o endereço.',
                            life: 3000,
                        });
                        console.error('Erro ao atualizar endereço:', error); // TODO remover após teste
                    },
                });
            } else {
                // Criar novo endereço
                this.addressService.createAddress(this.userId, addressData).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Endereço salvo com sucesso',
                            life: 3000,
                        });
                        this.hideDialog();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro ao salvar endereço',
                            detail: error?.error?.message || 'Não foi possível salvar o endereço.',
                            life: 3000,
                        });
                        console.error('Erro ao salvar endereço:', error); // TODO remover após teste
                    },
                });
            }
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Por favor, preencha os campos obrigatórios',
                life: 3000,
            });
        }
    }

    excluirEndereco() {
        if (this.address_id) {
            this.addressService.deleteAddress(this.userId, this.address_id).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Endereço excluído com sucesso',
                        life: 3000,
                    });
                    this.hideDialog();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro ao excluir endereço',
                        detail: error?.error?.message || 'Não foi possível excluir o endereço.',
                        life: 3000,
                    });
                    console.error('Erro ao excluir endereço:', error); // TODO remover após teste
                },
            });
        }
    }
}
