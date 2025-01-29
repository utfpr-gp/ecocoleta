import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {User, UserRole, UserService} from "../../user/user.service";
import {CommonModule} from "@angular/common";
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from "primeng/tooltip";
import {StatusTranslatePipe} from 'src/app/core/services/status-translate.pipe';
import {EvaluateDialogComponent} from "../../../shared-components/evaluate-collect-dialog/evaluate-dialog.component";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";
import {AvatarModule} from "primeng/avatar";
import {RatingModule} from "primeng/rating";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-user-list-company',
    standalone: true,
    imports: [
        PanelModule,
        TableModule,
        ButtonModule,
        CommonModule,
        TooltipModule,
        StatusTranslatePipe,
        EvaluateDialogComponent,
        DialogModule,
        ToastModule,
        UserFormComponent,
        AvatarModule,
        RatingModule,
        FormsModule,
    ],
    templateUrl: './user-list-company.component.html',
    styleUrl: './user-list-company.component.scss'
})
export class UserListCompanyComponent implements OnInit {
    wasteCollectors: User[] = [];
    totalRecords: number = 0;
    loading: boolean = false;
    pageSize: number = 10;
    currentPage: number = 0;

    // Estado dos Dialogs
    detailsDialogVisible: boolean = false;
    deactivateDialogVisible: boolean = false;
    selectedCollector: User | null = null;
    formModeUpdate: boolean = true; // Sempre editando

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.loadWasteCollectors(0, this.pageSize);
    }

    /** 🔄 Carrega os Catadores com Paginação */
    loadWasteCollectors(page: number, size: number): void {
        this.loading = true;

        this.userService.getUsersByRole(UserRole.WASTE_COLLECTOR, page, size).subscribe({
            next: (data) => {
                this.wasteCollectors = data.content;
                this.totalRecords = data.totalElements;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os catadores.'
                });
            }
        });
    }

    /** 📄 Paginação */
    onPageChange(event: any): void {
        this.loadWasteCollectors(event.first / event.rows, event.rows);
    }

    /** ℹ️ Abre o Dialog e carrega o usuário */
    openDetailsDialog(collectorId: string): void {
        this.loading = true;
        this.userService.getUserById(collectorId).subscribe({
            next: (user) => {
                this.selectedCollector = user;
                this.detailsDialogVisible = true;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os detalhes do catador.'
                });
            }
        });
    }

    /** 🛑 Abre o Dialog de Confirmação de Desativação */
    openDeactivateDialog(collector: User): void {
        this.selectedCollector = collector;
        this.deactivateDialogVisible = true;
    }

    // TODO: Implementar a desativação do catador

    /** ✅ Confirma a Desativação */
    confirmDeactivate(): void {
        if (!this.selectedCollector) return;

        this.userService.deactivateUser(this.selectedCollector.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `Catador ${this.selectedCollector.name} desativado com sucesso!`
                });

                this.deactivateDialogVisible = false;
                this.selectedCollector = null;
                this.loadWasteCollectors(this.currentPage, this.pageSize);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível desativar o catador.'
                });
            }
        });
    }

    /** ❌ Fecha o Dialog */
    closeDetailsDialog(): void {
        this.detailsDialogVisible = false;
        this.selectedCollector = null;
    }

    // TODO: Implementar a atualização do catador

    /** 📩 Atualiza os Dados ao Submeter o Formulário */
    handleFormSubmission(event: { user: User, action: 'update' }) {
        this.userService.createAndUpdateUser(event.user).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Catador ${event.user.name} atualizado com sucesso!`
            });

            this.closeDetailsDialog();
            this.loadWasteCollectors(this.currentPage, this.pageSize);
        }).catch(() => {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar o catador.'
            });
        });
    }
}
