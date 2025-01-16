import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export type Collect = {
    id: string;
    isIntern?: string;
    schedule?: string;
    picture?: string | File;
    amount?: number;
    status?: CollectStatus;
    initTime?: string;
    endTime?: string;
    createTime?: string;
    updateTime?: string;
    id_address?: number;
    id_resident?: number;
    id_waste_collector?: number;
    materials?: MateriaisReciclaveis[]; // Lista de materiais recicláveis
};

export enum MateriaisReciclaveis {
    VIDRO = 'VIDRO',
    PLASTICO = 'PLÁSTICO',
    PAPEL = 'PAPEL',
    METAL = 'METAL',
    ELETRONICO = 'ELERÔNICO',
    OUTROS = 'OUTROS',
}

export enum CollectStatus {
    PENDING = 'PENDING',
    PAUSED = 'PAUSED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

@Injectable({
    providedIn: 'root',
})
export class CollectService {
    apiUrl: string = `${environment.API}/collect`;

    constructor(
        private http: HttpClient,
    ) {
    }


    /**
     * Cria uma nova coleta.
     *
     * Este método faz uma requisição HTTP para o endpoint `/create_new_collect`,
     * enviando os dados de uma nova coleta para serem salvos no servidor.
     *
     * @param collect - Dados da coleta a ser criada.
     * @returns Observable contendo os dados da coleta criada.
     */
    createCollect(collect: Collect): Observable<Collect> {
        return this.http.post<Collect>(`${this.apiUrl}/create_new_collect`, collect);
    }

    /**
     * Atualiza uma coleta existente.
     *
     * Este método faz uma requisição HTTP para atualizar os dados de uma coleta existente.
     * O ID da coleta é obrigatório para identificar o registro a ser atualizado.
     *
     * @param collect - Dados atualizados da coleta.
     * @returns Observable contendo os dados da coleta atualizada.
     * @throws Error se o ID da coleta não for fornecido.
     */
    updateCollect(collect: Collect): Observable<Collect> {
        if (!collect.id) {
            throw new Error('O ID da coleta é obrigatório para atualizações.');
        }
        return this.http.put<Collect>(`${this.apiUrl}/${collect.id}`, collect);
    }

    /**
     * Obtém coletas filtradas por status e usuário.
     *
     * Este método faz uma requisição HTTP ao endpoint `/get_collects` para buscar coletas específicas
     * de um usuário, filtradas pelo status e paginadas de acordo com os parâmetros fornecidos.
     *
     * @param userId - ID do usuário para quem as coletas serão buscadas.
     * @param collectStatus - Status das coletas a serem buscadas (ex.: `PENDING`, `COMPLETED`).
     * @param page - Número da página (inicia em 0, padrão: 0).
     * @param size - Quantidade de registros por página (padrão: 10).
     * @returns Observable contendo a lista de coletas.
     */
    getCollectsByStatus(userId: number, collectStatus: CollectStatus, page: number = 0, size: number = 10): Observable<Collect[]> {
        const params = new HttpParams()
            .set('userId', userId)
            .set('collectStatus', collectStatus)
            .set('page', page)
            .set('size', size);

        return this.http.get<Collect[]>(`${this.apiUrl}/get_collects`, {params});
    }

    /**
     * Obtém coletas ativas para um usuário.
     *
     * Este método faz uma requisição HTTP ao endpoint `/active_collects` para buscar as coletas ativas
     * associadas a um usuário. Coletas ativas incluem os status:
     * - `PENDING`
     * - `PAUSED`
     * - `IN_PROGRESS`
     * - `COMPLETED` (não avaliadas).
     *
     * @param userId - ID do usuário.
     * @param page - Número da página (inicia em 0, padrão: 0).
     * @param size - Quantidade de registros por página (padrão: 10).
     * @returns Observable contendo os dados das coletas ativas paginadas.
     */
    getActiveCollects(userId: string, page: number = 0, size: number = 10): Observable<any> {
        const params = new HttpParams()
            .set('userId', userId)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<any>(`${this.apiUrl}/active_collects`, {params});
    }

    /**
     * Obtém o histórico de coletas para um usuário.
     *
     * Este método faz uma requisição HTTP ao endpoint `/history_collects` para buscar as coletas
     * com status de histórico, como:
     * - `COMPLETED`
     * - `CANCELLED`
     *
     * A resposta é paginada com os registros da página solicitada.
     *
     * @param userId - ID do usuário.
     * @param page - Número da página (inicia em 0, padrão: 0).
     * @param size - Quantidade de registros por página (padrão: 10).
     * @returns Observable contendo os dados do histórico de coletas paginadas.
     */
    getHistoryCollects(userId: string, page: number = 0, size: number = 10): Observable<any> {
        const params = new HttpParams()
            .set('userId', userId)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<any>(`${this.apiUrl}/history_collects`, {params});
    }

    /**
     * Obtém todos os materiais recicláveis disponíveis.
     *
     * Este método retorna a lista de valores definidos no enum `MateriaisReciclaveis`,
     * representando os materiais recicláveis suportados no sistema.
     *
     * @returns Lista de materiais recicláveis.
     */
    getMaterials(): MateriaisReciclaveis[] {
        return Object.values(MateriaisReciclaveis);
    }


}
