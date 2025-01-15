import {Component, OnInit} from '@angular/core';
import {Collect, CollectService, CollectStatus} from "../collect.service";
import {MessageService} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {User, UserService} from "../../user/user.service";

@Component({
    selector: 'app-current-collect',
    standalone: true,
    imports: [
        PanelModule,
        TableModule
    ],
    templateUrl: './current-collect.component.html',
    styleUrl: './current-collect.component.scss'
})
export class CurrentCollectComponent implements OnInit {
    collects: Collect[] = [];
    totalRecords: number = 0;
    loading: boolean = false;

    user: User | null = null;


    // Filtros
    // userId: number = 1; // Simulação do ID do usuário logado
    // collectStatus: CollectStatus = CollectStatus.IN_PROGRESS;

    constructor(
        private collectService: CollectService,
        private userService: UserService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
        this.loadCollects(0, 10); // Carrega a primeira página com 10 registros
    }

    /**
     * Carrega as coletas de acordo com a página e tamanho.
     * @param page Número da página.
     * @param size Tamanho da página.
     */
    loadCollects(page: number, size: number): void {
        this.loading = true;

        console.log('Carregando coletas... USERID: ' + this.user.id + ' PAGE:' + page + ' SIZE:' + size); // TODO REMOVER

        this.collectService
            // .getCollectsByStatus(this.userId, this.collectStatus, page, size)
            .getActiveCollects(this.user.id, page, size)
            .subscribe({
                next: (response) => {

                    console.log('Coletas carregadas:', response); // TODO REMOVER

                    this.collects = response; // Dados da API
                    this.totalRecords = response.length; // Ajuste se o backend retornar o total
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Erro ao carregar coletas:', err);
                    this.loading = false;

                    // Exibe mensagem de erro
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Não foi possível carregar as coletas.',
                    });
                },
            });
    }

    /**
     * Ação ao clicar em pausar a coleta.
     * @param collect Coleta a ser pausada.
     */
    pauseCollect(collect: Collect): void {
        // Simulação de lógica para pausar a coleta
        console.log('Coleta pausada:', collect);
        this.messageService.add({
            severity: 'info',
            summary: 'Pausar Coleta',
            detail: `Coleta #${collect.id} foi pausada.`,
        });
    }

    /**
     * Ação ao clicar em deletar a coleta.
     * @param collect Coleta a ser deletada.
     */
    deleteCollect(collect: Collect): void {
        // Simulação de lógica para deletar a coleta
        console.log('Coleta deletada:', collect);
        this.messageService.add({
            severity: 'success',
            summary: 'Deletar Coleta',
            detail: `Coleta #${collect.id} foi deletada com sucesso.`,
        });
    }

    /**
     * Ação ao clicar em avaliar a coleta.
     * @param collect Coleta a ser avaliada.
     */
    evaluateCollect(collect: Collect): void {
        console.log('Avaliar coleta:', collect);
        this.messageService.add({
            severity: 'info',
            summary: 'Avaliar Coleta',
            detail: `Coleta #${collect.id} está sendo avaliada.`,
        });
    }

}
