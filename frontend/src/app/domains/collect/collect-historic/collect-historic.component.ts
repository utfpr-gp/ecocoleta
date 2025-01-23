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

@Component({
  selector: 'app-coletas-historico',
  standalone: true,
    imports: [
        PanelModule,
        TableModule,
        ButtonModule,
        CommonModule,
        TooltipModule,
        StatusTranslatePipe
    ],
  templateUrl: './collect-historic.component.html',
  styleUrl: './collect-historic.component.scss'
})
export class CollectHistoricComponent implements OnInit {
    collects: Collect[] = [];
    totalRecords: number = 0;
    loading: boolean = false;
    user: User | null = null;

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
                console.log('Coletas carregadas:', response); //todo remover
                this.collects = response.content; // Registros da página atual
                this.totalRecords = response.totalElements; // Total de registros no banco
                this.loading = false;
            },
            error: (err) => {
                console.error('Erro ao carregar histórico de coletas:', err); //todo remover
                this.loading = false;

                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar o histórico de coletas.',
                });
            },
        });
    }

    evaluateCollect(collect: Collect): void {
        console.log('Avaliar coleta:', collect);
        this.messageService.add({
            severity: 'info',
            summary: 'Avaliar Coleta',
            detail: `Coleta #${collect.id} está sendo avaliada.`,
        });
    }
}
