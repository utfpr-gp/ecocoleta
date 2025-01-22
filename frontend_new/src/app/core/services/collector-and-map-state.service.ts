import {Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {LocationService} from './location.service';
import {Collect, CollectService} from '../../domains/collect/collect.service';
import {WasteCollectorService} from "./waste-collector.service";

/*
* fazer o footer se comunicar com o home-waste */

@Injectable({
    providedIn: 'root',
})
export class CollectorAndMapStateService {
    // Estado das coletas e do mapa
    private coletaStatus = new BehaviorSubject<boolean>(false);

    private coletaData = new BehaviorSubject<Collect[]>([]);
    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
    private mapCenter = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
    private mapMarkers = new BehaviorSubject<google.maps.MarkerOptions[]>([]);
    private mapZoom = new BehaviorSubject<number>(15);

    coletaStatus$ = this.coletaStatus.asObservable().pipe(distinctUntilChanged());

    coletaData$ = this.coletaData.asObservable();
    location$ = this.location.asObservable();
    mapCenter$ = this.mapCenter.asObservable();
    mapMarkers$ = this.mapMarkers.asObservable();
    mapZoom$ = this.mapZoom.asObservable();

    // TOOD injetar user observable aqui...
    constructor(
        private locationService: LocationService,
        private collectService: CollectService,
        private wasteCollectorService: WasteCollectorService
    ) {
    }

    /**
     * Restaura o estado do componente ao inicializar.
     */
    restoreState(): void {

        console.log('CollectorAndMapStateService restoreState'); // TODO REMOVER

        const currentLocation = this.location.getValue();
        const currentMarkers = this.mapMarkers.getValue();
        const currentCenter = this.mapCenter.getValue();
        // const currentCollectData = this.coletaData.getValue();
        // TODO pegar rota etc ...

        if (currentLocation) {
            console.log('CollectorAndMapStateService restoreState - currentLocation: ', currentLocation); // TODO REMOVER
            this.setLocation(currentLocation);
        }

        if (currentMarkers.length > 0) {
            console.log('CollectorAndMapStateService restoreState - currentMarkers: ', currentMarkers); // TODO REMOVER
            this.setMapMarkers(currentMarkers);
        }

        if (currentCenter) {
            console.log('CollectorAndMapStateService restoreState - currentCenter: ', currentCenter); // TODO REMOVER
            this.setMapCenter(currentCenter);
        }

        // if (currentCollectData.length > 0) {
        //     console.log('CollectorAndMapStateService restoreState - currentCollectData: ', currentCollectData); // TODO REMOVER
        //     this.setColetasData(currentCollectData);
        // }
    }

    //*--------------------------- Gerenciar estado do mapa -----------------------------------*//
    setMapCenter(center: google.maps.LatLngLiteral): void {
        this.mapCenter.next(center);
    }

    setMapMarkers(markers: google.maps.MarkerOptions[]): void {
        this.mapMarkers.next(markers);
    }

    clearMapMarkers(): void {
        this.setMapMarkers([]);
    }

    setMapZoom(zoom: number): void {
        this.mapZoom.next(zoom);
    }

    setLocation(location: { lat: number; lng: number }): void {
        this.location.next(location);
    }

    //*--------------------------- Gerenciar coleta -----------------------------------*//
    // setColetaStatus(status: boolean): void {
    //     this.coletaStatus.next(status);
    // }
    //
    // getColetaStatus(): boolean {
    //     return this.coletaStatus.getValue();
    // }
    //
    // setColetasData(coletas: Collect[]): void {
    //     this.coletaData.next(coletas);
    // }


    startCollection(collectorId: string): void {
        if (!this.coletaStatus.getValue()) {
            console.log('Iniciando coleta...');
            this.coletaStatus.next(true);
        }
    }

    stopCollection(): void {
        if (this.coletaStatus.getValue()) {
            console.log('Parando coleta...');
            this.coletaStatus.next(false);
        }
    }

    // /**
    //  * Inicia a coleta, carrega pontos de coleta e ativa o monitoramento.
    //  * @param collectorId ID do WasteCollector.
    //  */
    // startCollection(collectorId: string): void {
    //     console.log('startCollection - START - CollectorAndMapStateService'); // TODO REMOVER
    //     this.setColetaStatus(true);
    //     // this.location$.subscribe(location => {
    //     //     if (location) {
    //     //         console.log('CollectorAndMapStateService - startCollection - ENTROU NO IF - location: ', location); // TODO REMOVER
    //     //
    //     //         this.collectService.getReservedCollects(collectorId, location.lng, location.lat).subscribe((coletas: Collect[]) => {
    //     //             console.log('CollectorAndMapStateService - startCollection - PEGOU AS COLETAS - coletas: ', coletas); // TODO REMOVER
    //     //             if (coletas.length === 0) {
    //     //                 console.warn('Nenhuma coleta disponível para iniciar.'); // TODO REMOVER ou muda rpara um message service
    //     //                 return;
    //     //             }
    //     //
    //     //             this.setColetasData(coletas);
    //     //             this.setColetaStatus(true);
    //     //
    //     //             // Limpa os marcadores antes de adicionar os novos
    //     //             this.clearMapMarkers();
    //     //
    //     //             // Define os novos marcadores
    //     //             const markers = coletas.map(coleta => ({
    //     //                 position: {lat: coleta.latitude!, lng: coleta.longitude!},
    //     //                 title: `Coleta ${coleta.id}`,
    //     //             }));
    //     //             this.setMapMarkers(markers);
    //     //
    //     //             // TODO continuar aqui na rota
    //     //             // this.generateRoute();
    //     //         });
    //     //     }else {
    //     //         console.log('CollectorAndMapStateService - startCollection - NÃO ENTROU NO IF - location: ', location); // TODO REMOVER
    //     //     }
    //     // });
    // }
    //
    //
    // /**
    //  * Para a coleta.
    //  */
    // stopCollection(): void {
    //     this.setColetaStatus(false);
    //     //TODO melhorar, parar markers, rota, etc
    //     console.log('stopCollection - STOP - CollectorAndMapStateService'); // TODO REMOVER
    //     // this.stopLocationMonitoring();
    //     // this.coletaData.next([]);
    // }

    // //*--------------------------- Gerenciar localização -----------------------------------*//
    // /**
    //  * Inicia o monitoramento de localização para WasteCollector.
    //  */
    // startLocationMonitoring(): void {
    //     this.locationService.watchLocation((position) => {
    //         const location = {lat: position.coords.latitude, lng: position.coords.longitude};
    //         this.location.next(location);
    //
    //         console.log('STATE-SERVICE - startLocationMonitoring - location: ', location); // TODO REMOVER
    //         // Verifica a proximidade com as coletas
    //         this.checkProximity(location);
    //     });
    // }
    //
    // /**
    //  * Para o monitoramento de localização.
    //  */
    // stopLocationMonitoring(): void {
    //     this.locationService.clearWatch();
    // }
    //
    // // Verifica proximidade com as coletas
    // private checkProximity(location: { lat: number; lng: number }): void {
    //
    //     console.log('checkProximity - location: ', location); // TODO REMOVER
    //
    //     const coletas = this.coletaData.getValue();
    //     const threshold = 0.00030; // Aproximadamente 30 metros
    //
    //     coletas.forEach((coleta) => {
    //         const distance =
    //             Math.sqrt(
    //                 Math.pow(location.lat - coleta.latitude, 2) +
    //                 Math.pow(location.lng - coleta.longitude, 2)
    //             );
    //
    //         if (distance <= threshold) {
    //             console.log(`Coleta ${coleta.id} próxima!!!.`);
    //             // Notifica o backend para marcar a coleta como concluída
    //             // this.collectService.finalizeColeta(coleta.id).subscribe(() => {
    //             //     console.log(`Coleta ${coleta.id} concluída.`);
    //             //     // Remove a coleta da lista após concluída
    //             //     this.setColetasData(coletas.filter((c) => c.id !== coleta.id));
    //             // });
    //         }
    //     });
    // }
    //
    //
    // generateRoute(): void {
    //     const coletas = this.coletaData.getValue(); // Obtem as coletas em andamento
    //     if (coletas.length < 2) {
    //         console.warn('Pontos insuficientes para gerar uma rota.');
    //         return;
    //     }
    //
    //     const waypoints = coletas.map((c) => ({
    //         lat: c.latitude,
    //         lng: c.longitude,
    //     }));
    //
    //     const directionsService = new google.maps.DirectionsService();
    //     const directionsRenderer = new google.maps.DirectionsRenderer();
    //
    //     // Referência ao mapa DOM
    //     const mapElement = document.getElementById('home-map') as HTMLElement; // Atualize o ID conforme necessário
    //     if (!mapElement) {
    //         console.error('Elemento do mapa não encontrado.');
    //         return;
    //     }
    //
    //     const map = new google.maps.Map(mapElement, {
    //         center: waypoints[0],
    //         zoom: this.mapZoom.getValue(),
    //     });
    //
    //     directionsRenderer.setMap(map);
    //
    //     directionsService.route(
    //         {
    //             origin: waypoints[0],
    //             destination: waypoints[waypoints.length - 1],
    //             waypoints: waypoints.slice(1, -1).map((point) => ({location: point})),
    //             travelMode: google.maps.TravelMode.WALKING, // Modo de deslocamento
    //         },
    //         (result, status) => {
    //             if (status === google.maps.DirectionsStatus.OK) {
    //                 directionsRenderer.setDirections(result);
    //             } else {
    //                 console.error('Falha ao gerar rota:', status);
    //             }
    //         }
    //     );
    // }
}
