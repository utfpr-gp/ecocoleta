import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

export type Collect = {
    id?: string;
    amount?: number;
    status?: CollectStatus;
    initTime?: string;
    endTime?: string;
    createTime?: string;
    updateTime?: string;
    addressId?: number;
    residentId?: number;
    wasteCollectorId?: number;
    longitude?: number;
    latitude?: number;
    location?: string;
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

export interface CollectStatusCount {
    status: string;
    count: number;
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
     * Finaliza uma coleta.
     *
     * Este método faz uma requisição HTTP para o endpoint `/finish_collect`
     *
     * @param coleta
     * @returns Observable contendo a resposta do backend.
     */
    finalizeColeta(coleta: Collect): Observable<any> {
        return this.http.post(`${this.apiUrl}/finish_collect`, coleta);
    }

    /**
     * Reseta todas as coletas atreladas a um WasteCollector.
     *
     * Este método faz uma requisição HTTP DELETE para o endpoint `/reset_collects`
     * enviando o ID do WasteCollector para resetar as coletas associadas.
     *
     * @param wasteCollectorId - ID do WasteCollector cujas coletas serão resetadas.
     * @returns Observable contendo a resposta do backend.
     */
    resetCollects(wasteCollectorId: string): Observable<void> {
        const params = new HttpParams().set('wasteCollectorId', wasteCollectorId.toString());
        return this.http.delete<void>(`${this.apiUrl}/reset_collects`, {params});
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
    getCollectsByStatus(userId: string, collectStatus: CollectStatus, page: number = 0, size: number = 10): Observable<Collect[]> {
        const params = new HttpParams()
            .set('userId', userId)
            .set('collectStatus', collectStatus)
            .set('page', page)
            .set('size', size);

        return this.http.get<Collect[]>(`${this.apiUrl}/get_collects`, {params});
    }

    /**
     * Obtém coletas atuais para um usuário.
     *
     * Este método faz uma requisição para buscar as coletas ativas
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

    //WASTECOLLECTOR>>
    /**
     * Obtém coletas disponíveis sem atrelar ao WasteCollector.
     *
     * Este método faz uma requisição HTTP ao endpoint `/get_show_unlinked_collects`
     * para buscar coletas disponíveis sem serem reservadas para um WasteCollector.
     *
     * @param longitude - Longitude para a busca.
     * @param latitude - Latitude para a busca.
     * @param radius - Raio de busca em metros (padrão: 10 km).
     * @returns Observable contendo a lista de coletas disponíveis.
     */
    getUnlinkedCollects(longitude: number, latitude: number, radius: number = 10000): Observable<Collect[]> {
        const body = {
            currentLongitude: longitude,
            currentLatitude: latitude,
        };

        return this.http.post<Collect[]>(`${this.apiUrl}/get_show_unlinked_collects?radius=${radius}`, body);
    }

    /**
     * Obtém coletas disponíveis e as reserva para um WasteCollector.
     *
     * Este método faz uma requisição HTTP ao endpoint `/get_avaible_collects_reserved`
     * para buscar e reservar coletas disponíveis para um WasteCollector específico.
     *
     * @param idWasteCollector - ID do WasteCollector.
     * @param longitude - Longitude para a busca.
     * @param latitude - Latitude para a busca.
     * @param radius - Raio de busca em metros (padrão: 3 km).
     * @param limit - Limite de coletas a serem retornadas (padrão: 3).
     * @returns Observable contendo a lista de coletas reservadas.
     */
    getReservedCollects(
        idWasteCollector: string,
        longitude: number,
        latitude: number,
        // radius: number = 5000,
        // limit: number = 3
    ): Observable<Collect[]> {
        const body = {
            idWasteCollector,
            currentLongitude: longitude,
            currentLatitude: latitude
        };

        // const params = new HttpParams()
        //     .set('radius', radius.toString())
        //     .set('limit', limit.toString());

        // return this.http.post<Collect[]>(`${this.apiUrl}/get_avaible_collects_reserved`, body, {params});
        return this.http.post<Collect[]>(`${this.apiUrl}/get_avaible_collects_reserved`, body);
    }

    /**
     * Cancela uma coleta por id.
     * @param collectId - ID da coleta a ser cancelada.
     * @returns Observable contendo a resposta do backend.
     * @throws Error se o ID da coleta não for fornecido.
     */
    cancelCollect(collectId: string): Observable<any> {
        const params = new HttpParams().set('collectId', collectId);
        return this.http.delete<any>(`${this.apiUrl}/cancel_collect`, {params});
    }

    /**
     * Pausa ou ativa uma coleta tornando-a indisponível no momento.
     * @param collectId - ID da coleta a ser pausada ou ativada.
     * @returns Observable contendo o DTO da coleta atualizado.
     * @throws Error se o ID da coleta não for fornecido.
     */
    pauseOrActivateCollect(collectId: string): Observable<Collect> {
        const params = new HttpParams().set('collectId', collectId);
        return this.http.post<Collect>(`${this.apiUrl}/paused_collect`, null, { params });
    }

    /**
     * Avalia uma coleta.
     *
     * Este método faz uma requisição HTTP para o endpoint `/evaluate` para
     * registrar a avaliação de uma coleta e atualizar a pontuação média do catador.
     *
     * @param collectId - ID da coleta a ser avaliada.
     * @param rating - Avaliação dada pelo usuário (1 a 5 estrelas).
     * @returns Observable contendo a resposta do backend.
     */
    evaluateCollect(collectId: string, rating: number): Observable<void> {
        const params = new HttpParams().set('rating', rating);
        return this.http.post<void>(`${this.apiUrl}/evaluate/${collectId}`, null, { params });
    }

    getDailyCollectReport(): Observable<CollectStatusCount[]> {
        return this.http.get<CollectStatusCount[]>(`${this.apiUrl}/daily-report`);
    }

    getMonthlyCollectReport(): Observable<CollectStatusCount[]> {
        return this.http.get<CollectStatusCount[]>(`${this.apiUrl}/monthly-report`);
    }
}
