import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserRole, UserService} from "../user.service";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";
import {MessageService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {TableModule} from "primeng/table";
import {AddressService} from "../../../shared-components/address-form-dialog/address.service";
import {Address} from "../../../core/types/address.type";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";
import {AddressFormDialogComponent} from "../../../shared-components/address-form-dialog/address-form-dialog.component";
import {AvatarModule} from "primeng/avatar";
import {RatingModule} from "primeng/rating";
import {FormsModule} from '@angular/forms';
import {CardModule} from "primeng/card"; // Importação do FormsModule


@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [
        UserFormComponent,
        PanelModule,
        ButtonModule,
        ScrollPanelModule,
        TableModule,
        DialogModule,
        ToastModule,
        AddressFormDialogComponent,
        AvatarModule,
        RatingModule,
        FormsModule,
        CardModule
    ],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
    userId: string | null = null;
    user: User | null = null;
    userType: string = null;

    //Atributos para endereços e modal
    addresses: Address[] = [];  // Lista de endereços do usuário
    address_id: string | undefined = undefined;
    addressFormDialog: boolean = false;


    constructor(private router: Router,
                private paramsRoute: ActivatedRoute,
                private userService: UserService,
                private addressService: AddressService,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.userId = this.paramsRoute.snapshot.paramMap.get('user_id');

        if (this.userId) {
            console.log('userId', this.userId);

            // Chama o serviço para pegar os dados do usuário
            this.userService.getUserById(this.userId).subscribe(
                (user) => {
                    this.user = user;
                    this.userType = user.role;

                    // Carregar os endereços do usuário
                    this.loadUserAddresses();
                },
                (error) => {
                    // Mensagem de erro
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro ao carregar usuário',
                        detail: error?.message || 'Não foi possível carregar os dados do usuário.',
                        life: 3000,
                    });
                    console.error('Erro ao carregar dados do usuário:', error);
                }
            );
        }
    }

    handleFormSubmission(event: { user: User, action: 'create' | 'update' }) {
        const {user, action} = event;

        // if (action === 'create') {
        //     this.createUser(user);
        // }
        if (action === 'update') {
            this.updateUser(user);
        }
    }

    updateUser(user: User) {
        this.userService.createAndUpdateUser(user)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Usuário atualizado com sucesso!',
                    life: 3000,
                });
                this.router.navigate(['/home']);
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao atualizar usuário',
                    detail: error?.message,
                    life: 3000,
                });
            });
    }

    //ENDEREÇOS
    // Método para carregar os endereços do usuário
    loadUserAddresses() {
        if (this.userId) {
            this.addressService.getAllAddressByUserId(this.user.id).subscribe(
                (addresses) => {

                    this.addresses = addresses;
                },
                (error) => {
                    // Adiciona a mensagem no MessageService
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro endereços',
                        detail: error?.message || 'Não foi possível carregar os endereços.',
                        life: 3000
                    });
                }
            );
        }
    }

    // Método para abrir a modal de adicionar endereço
    openAddAddressModal() {
        this.addressFormDialog = true;
        // Aqui você pode abrir uma modal de adição de endereço
        // Defina a lógica para exibir a modal de adicionar
    }

    // Método para abrir a modal de edição de endereço
    openEditAddressModal(address: Address) {
        this.addressFormDialog = true;
        this.address_id = address.id;
        // Aqui você pode abrir uma modal de edição de endereço
        // Passe o endereço selecionado para editar
    }

    hideAddressDialog(bool: boolean) {
        // this.addressForm.reset();
        this.address_id = undefined;
        this.addressFormDialog = bool;
    }

    // Método para remover um endereço
    removeAddress(addressId: string) {
        if (this.userId) {
            this.addressService.deleteAddress(this.userId, addressId).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Endereço excluído com sucesso',
                        life: 3000,
                    });
                    // Recarregar a lista de endereços após a remoção
                    this.loadUserAddresses();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro ao excluir endereço',
                        detail: error?.message || 'Não foi possível excluir o endereço.',
                        life: 3000,
                    });
                },
            });
        }
    }
}
