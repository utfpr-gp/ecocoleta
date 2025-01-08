import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserRole, UserService} from "../user.service";
import {UserFormComponent} from "../../../shared_components/user-form/user-form.component";
import {MessageService} from "primeng/api";
import { CommonModule } from '@angular/common';
import {PanelModule} from "primeng/panel";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {TableModule} from "primeng/table";
import {AddressService} from "../../../core/services/address.service";
import {Address} from "../../../core/types/address.type";
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {ToastModule} from "primeng/toast";


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
        ToastModule
    ],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
    userId: string | null = null;
    user: User | null = null;
    userType: string = null;
    addresses: Address[] = [];  // Lista de endereços do usuário


    constructor(private router: Router,
                private paramsRoute: ActivatedRoute,
                private userService: UserService,
                private addressService: AddressService,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.userId = this.paramsRoute.snapshot.paramMap.get('user_id');

        if (this.userId) {

            console.log('userId', this.userId); //TODO apagar apos teste

            // Chama o serviço para pegar os dados do usuário
            this.userService.getUserById(this.userId).subscribe((user) => {
                this.user = user;
                this.userType = user.role;

                // Se necessário, adicione a lógica para preencher o formulário ou outros dados
                // this.loadForm();

                // TODO - talvez carregar aqui os dados e passar para o form depois de carregalos ???

                // Buscar os endereços do usuário
                this.loadUserAddresses();
            });
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

                console.log('Usuário atualizado com sucesso', user); // TODO apagar apos teste

                this.messageService.add({
                    severity: 'success',
                    summary: 'Usuário criado com sucesso!',
                    life: 3000,
                });
                this.router.navigate(['/home/user/perfil']);
            })
            .catch((error) => {

                console.error('Erro ao atualizar usuário:', error); // TODO: Remover após teste

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

                    console.log('Endereços do usuário:', addresses); //TODO apagar apos teste

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

                    // Opcional: logar o erro completo para depuração
                    console.error('Erro ao carregar endereços:', error); // TODO remover após teste
                }
            );
        }
    }

    // Método para abrir a modal de adicionar endereço
    openAddAddressModal() {
        // Aqui você pode abrir uma modal de adição de endereço
        // Defina a lógica para exibir a modal de adicionar
    }

    // Método para abrir a modal de edição de endereço
    openEditAddressModal(address: Address) {
        // Aqui você pode abrir uma modal de edição de endereço
        // Passe o endereço selecionado para editar
    }

    // Método para remover um endereço
    removeAddress(addressId: number) {
        if (this.userId) {
            this.addressService.deleteAddress(+this.userId, addressId).subscribe(
                () => {
                    this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Endereço removido com sucesso.'});
                    // Recarregar a lista de endereços após a remoção
                    this.loadUserAddresses();
                },
                (error) => {
                    this.messageService.add({severity: 'error', summary: 'Erro', detail: 'Não foi possível remover o endereço.'});
                }
            );
        }
    }


}
