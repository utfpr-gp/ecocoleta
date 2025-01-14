import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {User, UserService} from "../../domains/user/user.service";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {FileUploadModule} from "primeng/fileupload";
import {InputTextModule} from "primeng/inputtext";
import {MessageComponent} from "../message.component";
import {NgClass, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {ListboxModule} from "primeng/listbox";
import {Address} from "../../core/types/address.type";
import {Collect, MateriaisReciclaveis} from "../../domains/collect/collect.service";
import {AddressService} from "../address-form-dialog/address.service";
import {AddressFormDialogComponent} from "../address-form-dialog/address-form-dialog.component";

@Component({
  selector: 'app-collect-form',
  standalone: true,
    imports: [
        AvatarModule,
        ButtonModule,
        FileUploadModule,
        InputTextModule,
        MessageComponent,
        NgIf,
        PaginatorModule,
        PanelModule,
        PasswordModule,
        ReactiveFormsModule,
        RippleModule,
        TooltipModule,
        ListboxModule,
        NgClass,
        AddressFormDialogComponent
    ],
  templateUrl: './collect-form.component.html',
  styleUrl: './collect-form.component.scss'
})
export class CollectFormComponent implements OnInit {
    formCollect!: FormGroup;
    @Input() user: User | null = null;
    @Input() formData: Collect | null = null;
    @Input() formModeUpdate: boolean = false; //se editar ou cadastrar
    @Input() userRole: string = null;
    @Output() formSubmitted = new EventEmitter<{ collect: Collect, action: 'create' | 'update' }>();

    materials: { name: string, code: string }[] = [];

    //Atributos para endereços e modal
    addresses: Address[] = [];  // Lista de endereços do usuário
    addressFormDialog: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private addressService: AddressService,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        console.log('oninit form-collect'); //TODO apagar apos teste

        // Inicializar formulário
        this.initForm();

        // Caso seja modo de edição, carregar os dados do usuário no formulário
        if (this.formData) {

            console.log('iniciando formData collect-form: ', this.formData); //TODO apagar apos teste

            this.formCollect.patchValue(this.formData);
        }

        this.materials = this.transformEnumToOptions(MateriaisReciclaveis);
        this.loadUserAddresses();
        //TODO continuar form collect
    }

    initForm() {
        this.formCollect = this.formBuilder.group({
            materials: new FormControl([], Validators.required),
            amount: new FormControl('', [
                Validators.required,
                Validators.min(1)
            ]),
            address: new FormControl('', Validators.required)
        });
    }

    onSubmit() {
        if (this.formCollect.valid) {
            const collect = this.formCollect.value as Collect;

            if (this.formModeUpdate) {
                this.formSubmitted.emit({collect, action: 'update'});
            } else {
                this.formSubmitted.emit({collect, action: 'create'});
            }
        }
    }

    transformEnumToOptions(enumObj: any): { name: string, code: string }[] {
        return Object.keys(enumObj).map(key => ({
            name: enumObj[key],
            code: key
        }));
    }

    loadUserAddresses() {
        console.log('Carregando endereços do usuário:', this.user?.id); //TODO apagar apos teste

            this.addressService.getAllAddressByUserId(this.user?.id).subscribe(
                (addresses) => {

                    console.log('Endereços do usuário:', addresses); //TODO apagar apos teste

                    this.addresses = addresses;
                },
                (error) => {
                    // Adiciona a mensagem no MessageService
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro endereços',
                        detail: error?.error?.message || 'Não foi possível carregar os endereços.',
                        life: 3000
                    });

                    // Opcional: logar o erro completo para depuração
                    console.error('Erro ao carregar endereços:', error); // TODO remover após teste
                }
            );
        }

    // Abrir a modal de adicionar endereço
    openAddAddressModal() {
        this.addressFormDialog = true;
    }

    // Fecha modal de endereço
    hideAddressDialog(bool: boolean) {
        // this.addressForm.reset();
        this.addressFormDialog = bool;
        this.loadUserAddresses();
    }
}
