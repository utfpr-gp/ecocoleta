import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {User, UserRole, UserService} from "../../user/user.service";
import {CommonModule} from "@angular/common";
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";
import {AvatarModule} from "primeng/avatar";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-user-list-admin',
    standalone: true,
    imports: [
        PanelModule,
        TableModule,
        ButtonModule,
        CommonModule,
        TooltipModule,
        DialogModule,
        ToastModule,
        UserFormComponent,
        AvatarModule,
        RatingModule,
        FormsModule
    ],
    templateUrl: './user-list-admin.component.html',
    styleUrl: './user-list-admin.component.scss'
})
export class UserListAdminComponent implements OnInit {
    companies: User[] = [];
    totalRecords: number = 0;
    loading: boolean = false;
    pageSize: number = 10;
    currentPage: number = 0;

    detailsDialogVisible: boolean = false;
    deactivateDialogVisible: boolean = false;
    newCompanyDialogVisible: boolean = false;
    selectedCompany: User | null = null;
    formModeUpdate: boolean = true; // Sempre editando

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.loadCompanies(0, this.pageSize);
    }


    /** 🔄 Carrega as Prefeituras com Paginação */
    loadCompanies(page: number, size: number): void {
        this.loading = true;

        this.userService.getUsersByRole(UserRole.COMPANY, page, size).subscribe({
            next: (data) => {
                this.companies = data.content;
                this.totalRecords = data.totalElements;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar as prefeituras.'
                });
            }
        });
    }

    /** 📄 Paginação */
    onPageChange(event: any): void {
        this.loadCompanies(event.first / event.rows, event.rows);
    }

    /** ℹ️ Abre o Dialog e carrega a prefeitura selecionada */
    openDetailsDialog(companyId: string): void {
        this.loading = true;
        this.userService.getUserById(companyId).subscribe({
            next: (user) => {
                this.selectedCompany = user;
                this.detailsDialogVisible = true;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os detalhes da prefeitura.'
                });
            }
        });
    }

    // /** ✅ Confirma a Desativação */
    confirmDeactivate(): void {
        if (!this.selectedCompany) return;

        this.toggleUserStatus(this.selectedCompany, false);
        this.closeDeactivateDialog();
    }

    /** 🛑 Abre o Dialog de Confirmação de Desativação */
    openDeactivateDialog(company: User): void {
        this.selectedCompany = company;
        this.deactivateDialogVisible = true;
    }

    /** ✅ Alterna o status ativo/inativo de uma prefeitura */
    toggleUserStatus(company: User, newStatus: boolean): void {
        this.userService.toggleUserStatus(company.id, newStatus).subscribe({
            next: () => {
                const message = newStatus ? 'ativada' : 'desativada';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `Prefeitura ${company.name} ${message} com sucesso!`
                });
                this.loadCompanies(this.currentPage, this.pageSize);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível atualizar o status da prefeitura.'
                });
            }
        });
    }

    /** ❌ Fecha o Dialog */
    closeDetailsDialog(): void {
        this.detailsDialogVisible = false;
        this.selectedCompany = null;
    }

    /** ❌ Fecha o Dialog de Confirmação de Desativação */
    closeDeactivateDialog(): void {
        this.deactivateDialogVisible = false;
        this.selectedCompany = null;
    }

    /** 🆕 Abre o formulário em modo de criação */
    openCreateDialog(): void {
        this.newCompanyDialogVisible = true;
    }

    /** ❌ Fecha o formulário de criação */
    closeCreateDialog(): void {
        this.newCompanyDialogVisible = false;
        this.detailsDialogVisible = false;
        this.selectedCompany = null;    }

    /** 📩 Atualiza os Dados ao Submeter o Formulário */
    handleFormSubmission(event: { user: User, action: 'create' | 'update' }) {
        const {user, action} = event;

        user.role = UserRole.COMPANY;

        console.log('chamou handlesubmited event: ', event);

        this.userService.createAndUpdateUser(user).then(() => {
            const message = action === 'create' ? 'cadastrada' : 'atualizada';

            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Prefeitura ${user.name} ${message} com sucesso!`
            });

            this.closeCreateDialog();
            this.loadCompanies(this.currentPage, this.pageSize);
        }).catch(() => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: `Não foi possível ${action === 'create' ? 'cadastrar' : 'atualizar'} a prefeitura.`
            });
        });
    }
}
