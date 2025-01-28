import {Component, OnInit,} from '@angular/core';
import {Collect, CollectService, CollectStatus} from "../collect.service";
import {MessageService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {User, UserRole, UserService} from "../../user/user.service";
import {CommonModule} from "@angular/common";
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from "primeng/tooltip";
import {StatusTranslatePipe} from 'src/app/core/services/status-translate.pipe';
import {CollectorAndMapStateService} from "../../../core/services/collector-and-map-state.service";
import {DialogModule} from "primeng/dialog";
import {EvaluateDialogComponent} from "../../../shared-components/evaluate-collect-dialog/evaluate-dialog.component";

@Component({
    selector: 'app-current-collect',
    standalone: true,
    imports: [
        PanelModule,
        TableModule,
        ButtonModule,
        CommonModule,
        TooltipModule,
        StatusTranslatePipe,
        DialogModule,
        EvaluateDialogComponent
    ],
    templateUrl: './current-collect.component.html',
    styleUrl: './current-collect.component.scss'
})
export class CurrentCollectComponent implements OnInit {
    collects: Collect[] = [];
    totalRecords: number = 0;
    loading: boolean = false;

    user: User | null = null;

    // Dialogs
    detailsDialogVisible: boolean = false;
    cancelDialogVisible: boolean = false;
    pauseDialogVisible: boolean = false;
    evaluateDialogVisible: boolean = false;
    selectedCollectId: string | null = null;
    selectedCollect: Collect | null = null;

    constructor(
        private collectService: CollectService,
        private userService: UserService,
        private messageService: MessageService,
        private collectorAndMapStateService: CollectorAndMapStateService
    ) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
            this.loadCollectsBasedOnRole(0, 10); // Inicia o carregamento com a primeira página
        });
        // this.loadCollects(0, 10); // Carrega a primeira página com 10 registros

        // Inscrição no estado de coletaData (opcional, para mudanças dinâmicas)
        this.collectorAndMapStateService.coletaData.subscribe(coletaData => {
            if (this.user?.role === UserRole.WASTE_COLLECTOR) {
                console.log('Coletas atualizadas como waste collector:', coletaData); // TODO REMOVER
                this.collects = coletaData;
                this.totalRecords = coletaData.length;
            }
        });
    }

    /**
     * Carrega as coletas de acordo com o papel do usuário e a paginação.
     * @param offset Página atual (em registros).
     * @param rows Número de registros por página.
     */
    loadCollectsBasedOnRole(offset: number, rows: number): void {
        if (!this.user) return;

        this.loading = true;
        const page = offset / rows;

        if (this.user.role === UserRole.RESIDENT) {
            // Carregar coletas para Resident
            this.collectService.getActiveCollects(this.user.id, page, rows).subscribe({
                next: (response: any) => {
                    console.log('Coletas carregadas como resident:', response); // TODO REMOVER
                    this.collects = response.content;
                    this.totalRecords = response.totalElements;
                    this.loading = false;
                },
                error: (err) => {
                    this.handleError('Erro ao carregar coletas.', err);
                }
            });
        } else if (this.user.role === UserRole.WASTE_COLLECTOR) {
            console.log('l89 Carregando coletas como waste collector...'); // TODO REMOVER
            // Carregar coletas para WasteCollector (usando coletaData)
            const allColetas = this.collectorAndMapStateService.coletaData.getValue();
            this.collects = allColetas.slice(offset, offset + rows); // Paginação manual
            this.totalRecords = allColetas.length;
            this.loading = false;
        }
    }

    /**
     * Ação ao alterar a página ou número de registros por página.
     * @param event Evento de paginação.
     */
    onLazyLoad(event: { first: number; rows: number }): void {
        this.loadCollectsBasedOnRole(event.first, event.rows);
    }

    /**
     * Gerencia erros ao carregar coletas.
     * @param message Mensagem de erro a ser exibida.
     * @param error Objeto de erro retornado.
     */
    private handleError(message: string, error: any): void {
        console.error(message, error);
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message,
        });
        this.loading = false;
    }

    continueCollect(collect: Collect): void {
        // Simulação de lógica para continuar a coleta
        this.collectService.pauseOrActivateCollect(collect.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Coleta continuada com sucesso.',
                });
                this.loadCollectsBasedOnRole(0, 10); // Recarrega os dados
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível continuar a coleta.',
                });
            }
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

    // Cancelar
    openCancelDialog(collect: Collect): void {
        this.selectedCollect = collect;
        this.cancelDialogVisible = true;
    }

    closeCancelDialog(): void {
        this.cancelDialogVisible = false;
        this.selectedCollect = null;
    }

    confirmCancelCollect(): void {
        if (this.selectedCollect) {
            // Lógica para cancelar a coleta no backend
            this.collectService.cancelCollect(this.selectedCollect.id).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Coleta cancelada com sucesso.',
                    });
                    this.closeCancelDialog();
                    this.loadCollectsBasedOnRole(0, 10); // Recarrega os dados
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível cancelar a coleta.',
                    });
                }
            });
        }
    }

    // Pausar
    openPauseDialog(collect: Collect): void {
        this.selectedCollect = collect;
        this.pauseDialogVisible = true;
    }

    closePauseDialog(): void {
        this.pauseDialogVisible = false;
        this.selectedCollect = null;
    }

    confirmPauseCollect(): void {
        if (this.selectedCollect) {
            // Lógica para pausar a coleta no backend
            this.collectService.pauseOrActivateCollect(this.selectedCollect.id).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Coleta pausada com sucesso.',
                    });
                    this.closePauseDialog();
                    this.loadCollectsBasedOnRole(0, 10); // Recarrega os dados
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível pausar a coleta.',
                    });
                }
            });
        }
    }

    // Avaliar
    openEvaluateDialog(collect: Collect): void {
        this.selectedCollectId = collect.id;
        this.evaluateDialogVisible = true;
    }

    hideEvaluateDialog(bool: boolean) {
        this.selectedCollectId = null;
        this.evaluateDialogVisible = bool;
        this.loadCollectsBasedOnRole(0, 10); // Recarrega os dados
    }
}
