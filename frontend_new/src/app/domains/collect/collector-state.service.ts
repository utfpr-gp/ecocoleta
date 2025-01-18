import {Injectable} from '@angular/core';
import {BehaviorSubject, interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {LocationService} from '../../core/services/location.service';
import {CollectService} from './collect.service';

@Injectable({
    providedIn: 'root',
})
export class CollectorStateService {
    private coletaStatus = new BehaviorSubject<boolean>(false); // Coleta iniciada/pausada
    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null); // Localização atual
    private coletaData = new BehaviorSubject<any[]>([]); // Lista de coletas em andamento

    coletaStatus$ = this.coletaStatus.asObservable();
    location$ = this.location.asObservable();
    coletaData$ = this.coletaData.asObservable();

    constructor(
        private locationService: LocationService,
        private collectionService: CollectService
    ) {
    }

    setLocation(location: { lat: number; lng: number }): void {
        this.location.next(location);
    }


    // Inicia o monitoramento da coleta
    startCollection(): void {

        console.log('CollectorState - Iniciando coleta...'); // TODO REMOVER

        this.coletaStatus.next(true);
        this.monitorLocation();
        this.loadCollectionData();
    }

    // Para o monitoramento da coleta
    stopCollection(): void {

        console.log('CollectorState - Coleta pausada.'); // TODO REMOVER

        this.coletaStatus.next(false);
        this.locationService.clearWatch();
    }

    // Atualiza os dados de localização a cada 30 segundos
    private monitorLocation(): void {
        interval(3500) //3,5 segundos
            .pipe(
                switchMap(() => this.locationService.getCurrentLocation())
            )
            .subscribe((position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                console.log('Collector state - Localização atual coletada:', location); // TODO REMOVER

                this.location.next(location);
                this.checkProximity(location);
            });
    }

    // Carrega os dados das coletas em andamento
    private loadCollectionData(): void {

        console.log('CollectorState - Carregando coletas em andamento...'); // TODO REMOVER

        // this.collectionService.getColetasEmAndamento().subscribe((data) => {
        //     this.coletaData.next(data);
        // });
    }

    // Verifica proximidade com as coletas
    private checkProximity(location: { lat: number; lng: number }): void {
        const coletas = this.coletaData.getValue();
        const threshold = 0.00015; // Aproximadamente 15 metros

        coletas.forEach((coleta) => {
            const distance =
                Math.sqrt(
                    Math.pow(location.lat - coleta.latitude, 2) +
                    Math.pow(location.lng - coleta.longitude, 2)
                );
            if (distance <= threshold) {
                console.log(`Chegou perto da coleta ${coleta.id}`); // TODO REMOVER
                // TODO Notifica o backend sobre a proximidade
                // Notifica o backend sobre a coleta concluída
                // this.collectionService.finalizeColeta(coleta.id).subscribe();
            }
        });
    }
}
