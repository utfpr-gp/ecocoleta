import {Injectable} from '@angular/core';
import {BehaviorSubject, interval} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {LocationService} from './location.service';
import {CollectService} from '../../domains/collect/collect.service';
import {WasteCollectorService} from "./waste-collector.service";

@Injectable({
    providedIn: 'root',
})
export class CollectorAndMapStateService {
    // Estado das coletas
    private coletaStatus = new BehaviorSubject<boolean>(false); // Coleta iniciada/pausada
    private coletaData = new BehaviorSubject<any[]>([]); // Lista de coletas em andamento

    // Estado do mapa
    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null); // Localização atual
    private mapCenter = new BehaviorSubject<google.maps.LatLngLiteral>({lat: 0, lng: 0}); // Centro do mapa
    private mapMarkers = new BehaviorSubject<google.maps.MarkerOptions[]>([]); // Marcadores no mapa
    private mapZoom = new BehaviorSubject<number>(15); // Zoom do mapa

    coletaStatus$ = this.coletaStatus.asObservable();
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

    //*--------------------------- Gerenciar estado do mapa -----------------------------------*//
    setMapCenter(center: google.maps.LatLngLiteral): void {
        this.mapCenter.next(center);
    }

    setMapMarkers(markers: google.maps.MarkerOptions[]): void {
        this.mapMarkers.next(markers);
    }

    setMapZoom(zoom: number): void {
        this.mapZoom.next(zoom);
    }

    setLocation(location: { lat: number; lng: number }): void {
        this.location.next(location);
    }

    //*--------------------------- Gerenciar coleta -----------------------------------*//
    setColetaStatus(status: boolean): void {
        this.coletaStatus.next(status);
    }

    setColetasData(coletas: any[]): void {
        this.coletaData.next(coletas);
    }

    /**
     * Inicia a coleta, carrega pontos de coleta e ativa o monitoramento.
     * @param collectorId ID do WasteCollector.
     */
    startCollection(collectorId: string): void {
        // monitoramwento ja esta contecendo ativei no oninit do home-waste-collector
        // this.startLocationMonitoring(collectorId); // Inicia o monitoramento da localização
        this.location$.subscribe(location => {
            if (location) {
                //     // TODO fazer logica de collectservice...
                // Carrega pontos de coleta do backend
                this.collectService.getReservedCollects(collectorId, location.lng, location.lat).subscribe((coletas) => {
                    if (coletas.length === 0) {
                        console.warn('Nenhuma coleta disponível para iniciar.');
                        return;
                    }

                    // Atualiza o estado global
                    this.setColetasData(coletas);
                    this.setColetaStatus(true);

                    // Configura marcadores no mapa
                    const markers = coletas.map((coleta) => ({
                        position: {lat: coleta.latitude, lng: coleta.longitude},
                        title: `Coleta ${coleta.id}`,
                    }));
                    this.setMapMarkers(markers);

                    // Gera a rota com os pontos de coleta
                    this.generateRoute();
                });
            }
        });
    }

    /**
     * Para a coleta.
     */
    stopCollection(): void {
        this.stopLocationMonitoring();
        this.coletaData.next([]);
    }

    //*--------------------------- Gerenciar localização -----------------------------------*//
    /**
     * Inicia o monitoramento de localização para WasteCollector.
     * @param collectorId ID do WasteCollector.
     */
    startLocationMonitoring(collectorId: string): void {
        this.locationService.watchLocation((position) => {
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};
            this.location.next(location);

            // Verifica a proximidade com as coletas
            this.checkProximity(location);
        });
    }

    /**
     * Para o monitoramento de localização.
     */
    stopLocationMonitoring(): void {
        this.locationService.clearWatch();
    }

    // Verifica proximidade com as coletas
    private checkProximity(location: { lat: number; lng: number }): void {

        console.log('checkProximity - location: ', location); // TODO REMOVER

        const coletas = this.coletaData.getValue();
        const threshold = 0.00030; // Aproximadamente 30 metros

        coletas.forEach((coleta) => {
            const distance =
                Math.sqrt(
                    Math.pow(location.lat - coleta.latitude, 2) +
                    Math.pow(location.lng - coleta.longitude, 2)
                );

            if (distance <= threshold) {
                console.log(`Coleta ${coleta.id} próxima.`);
                // Notifica o backend para marcar a coleta como concluída
                // this.collectService.finalizeColeta(coleta.id).subscribe(() => {
                //     console.log(`Coleta ${coleta.id} concluída.`);
                //     // Remove a coleta da lista após concluída
                //     this.setColetasData(coletas.filter((c) => c.id !== coleta.id));
                // });
            }
        });
    }


    generateRoute(): void {
        const coletas = this.coletaData.getValue(); // Obtem as coletas em andamento
        if (coletas.length < 2) {
            console.warn('Pontos insuficientes para gerar uma rota.');
            return;
        }

        const waypoints = coletas.map((c) => ({
            lat: c.latitude,
            lng: c.longitude,
        }));

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        // Referência ao mapa DOM
        const mapElement = document.getElementById('home-map') as HTMLElement; // Atualize o ID conforme necessário
        if (!mapElement) {
            console.error('Elemento do mapa não encontrado.');
            return;
        }

        const map = new google.maps.Map(mapElement, {
            center: waypoints[0],
            zoom: this.mapZoom.getValue(),
        });

        directionsRenderer.setMap(map);

        directionsService.route(
            {
                origin: waypoints[0],
                destination: waypoints[waypoints.length - 1],
                waypoints: waypoints.slice(1, -1).map((point) => ({location: point})),
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Falha ao gerar rota:', status);
                }
            }
        );
    }
}
