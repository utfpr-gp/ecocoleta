import { Component, OnInit } from '@angular/core';
import { Collect, CollectService, CollectStatus } from "../collect.service";
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

@Component({
  selector: 'app-coletas-historico',
  standalone: true,
    imports: [
        PanelModule,
        TableModule,
        ButtonModule,
        CommonModule,
        TooltipModule,
        StatusTranslatePipe,
        EvaluateDialogComponent,
        DialogModule
    ],
  templateUrl: './collect-historic.component.html',
  styleUrl: './collect-historic.component.scss'
})
export class CollectHistoricComponent implements OnInit {
    collects: Collect[] = [];
    totalRecords: number = 0;
    loading: boolean = false;
    user: User | null = null;

    // Dialogs
    detailsDialogVisible: boolean = false;
    evaluateDialogVisible: boolean = false;
    selectedCollectId: string | null = null;
    selectedCollect: Collect | null = null;

    constructor(
        private collectService: CollectService,
        private userService: UserService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
        this.loadCollects(0, 10); // Carrega a primeira página com 10 registros
    }

    /**
     * Carrega as coletas de acordo com a página e tamanho.
     * @param offset Número da página.
     * @param rows Tamanho da página.
     */
    loadCollects(offset: number, rows: number): void {
        const page = offset / rows; // Calcula a página com base no offset
        this.loading = true;

        this.collectService.getHistoryCollects(this.user.id, page, rows).subscribe({
            next: (response: any) => {
                this.collects = response.content; // Registros da página atual
                this.totalRecords = response.totalElements; // Total de registros no banco
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar o histórico de coletas.: ' + err.message,
                });
            },
        });
    }

    // Dialogs
    // Detalhes
    openDetails(collect: Collect): void {
        this.selectedCollect = collect;
        this.detailsDialogVisible = true;
    }

    closeDetailsDialog(): void {
        this.detailsDialogVisible = false;
        this.selectedCollect = null;
    }

    // Avaliar
    openEvaluateDialog(collect: Collect): void {
        this.selectedCollectId = collect.id;
        this.evaluateDialogVisible = true;
    }

    hideEvaluateDialog(bool: boolean) {
        this.selectedCollectId = null;
        this.evaluateDialogVisible = bool;
        this.loadCollects(0, 10); // Recarrega os dados
    }
}
