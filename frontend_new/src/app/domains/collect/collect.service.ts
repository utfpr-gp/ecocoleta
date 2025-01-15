import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticateTokenService} from "../auth/authenticate-token.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {CloudinaryUploadImgService} from "../../core/services/cloudinary-upload-img.service";
import {User} from "../user/user.service";

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
        private messageService: MessageService
    ) {
    }


    /**
     * Cria uma nova coleta.
     * @param collect Dados da coleta a ser criada.
     * @returns Observable com os dados da coleta criada.
     */
    createCollect(collect: Collect): Observable<Collect> {
        return this.http.post<Collect>(`${this.apiUrl}/create_new_collect`, collect);
    }

    /**
     * Atualiza uma coleta existente.
     * @param collect Dados da coleta a ser atualizada.
     * @returns Observable com os dados da coleta atualizada.
     */
    updateCollect(collect: Collect): Observable<Collect> {
        if (!collect.id) {
            throw new Error('O ID da coleta é obrigatório para atualizações.');
        }
        return this.http.put<Collect>(`${this.apiUrl}/${collect.id}`, collect);
    }

    /**
     * Obtém coletas por status e usuário.
     * @param userId ID do usuário.
     * @param collectStatus Status das coletas.
     * @param page Página atual (para paginação).
     * @param size Tamanho da página.
     * @returns Observable com a lista de coletas.
     */
    getCollectsByStatus(
        userId: number,
        collectStatus: CollectStatus,
        page: number = 0,
        size: number = 10
    ): Observable<Collect[]> {
        const params = new HttpParams()
            .set('userId', userId)
            .set('collectStatus', collectStatus)
            .set('page', page)
            .set('size', size);

        return this.http.get<Collect[]>(`${this.apiUrl}/get_collects`, { params });
    }

    getActiveCollects(userId: string, page: number = 0, size: number = 10): Observable<Collect[]> {
        const params = new HttpParams().set('userId', userId).set('page', page).set('size', size);
        return this.http.get<Collect[]>(`${this.apiUrl}/active_collects`, { params });
    }

    /**
     * Retorna todos os materiais recicláveis disponíveis (baseado no enum).
     * @returns Lista de materiais recicláveis.
     */
    getMaterials(): MateriaisReciclaveis[] {
        return Object.values(MateriaisReciclaveis);
    }


}
