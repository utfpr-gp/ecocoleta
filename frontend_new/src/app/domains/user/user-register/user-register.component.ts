import {Component, Output} from '@angular/core';
import {User, UserRole, UserService} from "../user.service";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";
import {DialogModule} from "primeng/dialog";
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PanelModule} from "primeng/panel";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-access',
    templateUrl: './user-register.component.html',
    standalone: true,
    imports: [
        ToastModule,
        UserFormComponent,
        DialogModule,
        CommonModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        PanelModule,
        ReactiveFormsModule,
    ]
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

    handleFormSubmission(event: { user: User, action: 'create' | 'update' }) {
        const {user, action} = event;

        if (action === 'create') {
            this.createUser(user);
        }
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
