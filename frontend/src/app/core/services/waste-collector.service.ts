import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {UserRole} from "../../domains/user/user.service";

export interface WasteCollectorLocationDTO {
    wasteCollectorId: string;
    latitude: number;
    longitude: number;
}

export interface WasteCollectorDTO {
    id: string;
    cpf?: string;
    score?: number;
    picture?: string;
    location?: string
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole;
}

@Injectable({
    providedIn: 'root',
})
export class WasteCollectorService {
    private apiUrl = `${environment.API}/waste_collector`;

    constructor(private http: HttpClient) {}

    /**
     * Atualiza a localização do catador.
     * @param locationDTO Dados contendo ID, latitude e longitude.
     * @returns Observable de resposta.
     */
    updateWasteCollectorLocation(locationDTO: WasteCollectorLocationDTO): Observable<void> {

        console.log('updateWasteCollectorLocation atualizou localização catador wasteService: ', locationDTO); // TODO REMOVER

        return this.http.post<void>(`${this.apiUrl}/update_location`, locationDTO);
    }

    /**
     * Busca as localizações recentes dos catadores.
     * @returns Observable contendo lista de WasteCollectorLocationDTO.
     */
    getActiveCollectors(): Observable<WasteCollectorLocationDTO[]> {
        return this.http.get<WasteCollectorLocationDTO[]>(`${this.apiUrl}/recent_locations`)
            .pipe(
                tap((collectors) => {
                    console.log('getActiveCollectors collectors: ', collectors); // TODO REMOVER
                })
            );
    }

    /**
     * Busca os detalhes de um catador específico.
     * @param id ID do catador.
     * @returns Observable contendo WasteCollectorDTO.
     */
    getCollectorById(id: number): Observable<WasteCollectorDTO> {
        return this.http.get<WasteCollectorDTO>(`${this.apiUrl}/${id}`);
    }
}
