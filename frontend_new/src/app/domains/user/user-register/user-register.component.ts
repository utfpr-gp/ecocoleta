import {Component, Output} from '@angular/core';
import {User, UserRole, UserService} from "../user.service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-access',
    templateUrl: './user-register.component.html',
})
export class UserRegisterComponent {

    showModal = true;
    @Output() userType: UserRole | null = null;
    protected readonly UserRole = UserRole;

    constructor(private userService: UserService, private messageService: MessageService) {
    }

    selectUserType(type: UserRole) {
        this.userType = type;
        this.showModal = false;

        console.log("tipo de user :: " + type) //todo remover
    }

    // TODO implementar update de usuário
    handleFormSubmission(event: { user: User, action: 'create' | 'update' }) {
        const {user, action} = event;

        if (action === 'create') {
            this.createUser(user);
        }
        // else if (action === 'update') {
        //     this.updateUser(user);
        // }
    }

    // Cria um novo usuário
    private createUser(user: User) {
        if (!this.userType) {
            alert('Selecione o tipo de usuário antes de prosseguir.');
            return;
        }

        // Adiciona o tipo de usuário ao objeto
        user.role = this.userType;

        this.userService.createAndUpdateUser(user)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Usuário criado com sucesso!',
                    life: 3000,
                });
            })
            .catch((err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao criar usuário',
                    detail: err?.message,
                    life: 3000,
                });
            });

    }
}
