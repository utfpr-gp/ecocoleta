import { Component, OnInit } from '@angular/core';
import { MessageService } from "primeng/api";
import { PanelModule } from "primeng/panel";
import { TableModule } from "primeng/table";
import { User, UserService } from "../../user/user.service";
import { CommonModule } from "@angular/common";
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from "primeng/tooltip";
import { StatusTranslatePipe } from 'src/app/core/services/status-translate.pipe';
import {EvaluateDialogComponent} from "../../../shared-components/evaluate-collect-dialog/evaluate-dialog.component";
import {DialogModule} from "primeng/dialog";
import {ToastModule} from "primeng/toast";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";

@Component({
  selector: 'app-user-list-admin',
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
        UserFormComponent
    ],
  templateUrl: './user-list-admin.component.html',
  styleUrl: './user-list-admin.component.scss'
})
export class UserListAdminComponent implements OnInit {
    totalRecords: number = 0;
    loading: boolean = false;
    user: User | null = null;

    // Dialogs
    detailsDialogVisible: boolean = false;
    evaluateDialogVisible: boolean = false;
    selectedCollectId: string | null = null;

    constructor(
        private userService: UserService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
        // this.loadCollects(0, 10); // Carrega a primeira página com 10 registros
    }

    /**
     * Carrega as coletas de acordo com a página e tamanho.
     * @param offset Número da página.
     * @param rows Tamanho da página.
     */
    // loadCollects(offset: number, rows: number): void {
    //     const page = offset / rows; // Calcula a página com base no offset
    //     this.loading = true;
    //
    //     this.collectService.getHistoryCollects(this.user.id, page, rows).subscribe({
    //         next: (response: any) => {
    //             console.log('Coletas carregadas:', response); //todo remover
    //             this.collects = response.content; // Registros da página atual
    //             this.totalRecords = response.totalElements; // Total de registros no banco
    //             this.loading = false;
    //         },
    //         error: (err) => {
    //             console.error('Erro ao carregar histórico de coletas:', err); //todo remover
    //             this.loading = false;
    //
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Erro',
    //                 detail: 'Não foi possível carregar o histórico de coletas.',
    //             });
    //         },
    //     });
    // }

    // Dialogs
    // Detalhes
    // openDetails(collect: Collect): void {
    //     this.selectedCollect = collect;
    //     this.detailsDialogVisible = true;
    // }
    //
    // closeDetailsDialog(): void {
    //     this.detailsDialogVisible = false;
    //     this.selectedCollect = null;
    // }
    //
    // // Avaliar
    // openEvaluateDialog(collect: Collect): void {
    //     this.selectedCollectId = collect.id;
    //     this.evaluateDialogVisible = true;
    // }
    //
    // hideEvaluateDialog(bool: boolean) {
    //     this.selectedCollectId = null;
    //     this.evaluateDialogVisible = bool;
    //     this.loadCollects(0, 10); // Recarrega os dados
    // }
}
