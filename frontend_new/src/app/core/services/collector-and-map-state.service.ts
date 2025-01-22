import {Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Observable} from 'rxjs';
import {LocationService} from './location.service';
import {Collect, CollectService, CollectStatus} from '../../domains/collect/collect.service';
import {WasteCollectorService} from "./waste-collector.service";
import {MessageService} from "primeng/api";

/*
* fazer o footer se comunicar com o home-waste */

@Injectable({
    providedIn: 'root',
})
export class CollectorAndMapStateService {
    // Estado das coletas e do mapa
    private coletaStatus = new BehaviorSubject<boolean>(false);
    coletaStatus$ = this.coletaStatus.asObservable().pipe(distinctUntilChanged());

    private coletaData = new BehaviorSubject<Collect[]>([]);
    private mapMarkers = new BehaviorSubject<google.maps.MarkerOptions[]>([]);

    //Teste marcador user
    private userLocationMarker = new BehaviorSubject<google.maps.MarkerOptions | null>(null);
    userLocationMarker$ = this.userLocationMarker.asObservable();

    //sem uso ainda ...
    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
    private mapCenter = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);

    private mapZoom = new BehaviorSubject<number>(15);

    coletaData$ = this.coletaData.asObservable();
    location$ = this.location.asObservable();
    mapCenter$ = this.mapCenter.asObservable();
    mapMarkers$ = this.mapMarkers.asObservable();
    mapZoom$ = this.mapZoom.asObservable();

    // Coletas em processamento
    private processingCollects: Set<string> = new Set();

    // TOOD injetar user observable aqui...
    constructor(
        private locationService: LocationService,
        private collectService: CollectService,
        private messageService: MessageService,
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

    //*--------------------------- Gerenciar estados -----------------------------------*//
    getMapMarkers(): Observable<google.maps.MarkerOptions[]> {
        return this.mapMarkers.asObservable();
    }

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

    public setColetasData(updatedColetas: Collect[]): void {
        this.coletaData.next(updatedColetas); // Atualiza o BehaviorSubject
    }

    //*--------------------------- Gerenciar coleta -----------------------------------*//

    /**
     * Inicia a coleta e o monitoramento de localização.
     */
    startCollection(collectorId: string): void {
        if (!this.coletaStatus.getValue()) {
            console.log('Iniciando coleta...'); // TODO REMOVER
            // this.coletaStatus.next(true);
            this.locationService.getCurrentLocation().then((position) => {
                const location = {lat: position.coords.latitude, lng: position.coords.longitude};
                this.collectService.getReservedCollects(collectorId, location.lng, location.lat).subscribe((coletas) => {
                    if (coletas.length === 0) {
                        console.warn('Nenhuma coleta disponível.');
                        return;
                    }

                    // Atualiza o estado com as coletas e marcadores
                    this.coletaData.next(coletas);
                    const markers = coletas.map((coleta) => ({
                        position: {lat: coleta.latitude!, lng: coleta.longitude!},
                        title: `Coleta ${coleta.id}`,
                    }));
                    this.mapMarkers.next(markers);

                    // Define o status de coleta como ativo
                    this.coletaStatus.next(true);

                    // Inicia o monitoramento de localização
                    this.startLocationMonitoring();

                    console.log('Coleta iniciada com sucesso!'); //todo remover, add menssaage service
                });
            });
        }
    }

    /**
     * Para a coleta e o monitoramento de localização.
     */
    stopCollection(): void {
        if (this.coletaStatus.getValue()) {
            console.log('Parando coleta...'); //todo remover
            this.coletaStatus.next(false);
            this.coletaData.next([]);
            this.mapMarkers.next([]);

            // TODO mandar para o back que a coleta foi parada rota  reset_collects

            // Para o monitoramento de localização
            this.stopLocationMonitoring();
        //     TODO ao clicar em stop não esta parando de monitorar a localização
        }
    }

    //*--------------------------- Gerenciar localização -----------------------------------*//

    /**
     * Inicia o monitoramento de localização.
     */
    startLocationMonitoring(): void {
        console.log('Iniciando monitoramento de localização...');
        this.locationService.watchLocation((position) => {
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};
            this.location.next(location);

            // Atualiza o marcador da localização do usuário
            // this.updateUserLocationMarker(location);
            // TODO continuar marcador de user!!

            console.log('Nova localização monitorada:', location); // TODO REMOVER

            // Verifica proximidade com coletas (opcional)
            this.checkProximity(location);
        });
    }

    /**
     * Para o monitoramento de localização.
     */
    stopLocationMonitoring(): void {
        console.log('Parando monitoramento de localização...');
        this.locationService.clearWatch();
    }

    /**
     * Verifica proximidade com as coletas.
     */
    private checkProximity(location: { lat: number; lng: number }): void {

        console.log('checkProximity - location: ', location); // TODO REMOVER

        const coletas = this.coletaData.getValue(); // Obtem o array atual de coletas
        const threshold = 0.00020; // Aproximadamente 20 metros

        coletas.forEach((coleta) => {
            const distance =
                Math.sqrt(
                    Math.pow(location.lat - coleta.latitude, 2) +
                    Math.pow(location.lng - coleta.longitude, 2)
                );

            if (distance <= threshold && !this.processingCollects.has(coleta.id!)) {
                this.processingCollects.add(coleta.id!); // Marca a coleta como em processamento

                console.log(`Coleta ${coleta.id} próxima!!!.`);
                console.log('COLETADOOOOOOOO!!!: ', coleta); // TODO REMOVER

                // Verifica se a coleta está em `PENDING` ou `IN_PROGRESS`
                if (coleta.status === CollectStatus.PENDING || coleta.status === CollectStatus.IN_PROGRESS) {

                    console.log(' entrou no if de status coleta '); // TODO REMOVER

                    this.collectService.finalizeColeta(coleta).subscribe({
                        next: (response) => {
                            // Atualiza o estado local para refletir a coleta como `COMPLETED`
                            const updatedColetas = coletas.map((c) =>
                                c.id === coleta.id ? { ...c, status: 'COMPLETED' } : c
                            );
                            this.setColetasData(updatedColetas as Collect[]);
                            this.processingCollects.delete(coleta.id!); // Libera a coleta após o sucesso


                            // Exibe mensagem de sucesso
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Coleta Concluída',
                                detail: `Coleta ${coleta.id} foi marcada como concluída.`,
                            });
                        },
                        error: (error) => {
                            console.error(`Erro ao finalizar coleta ${coleta.id}:`, error);
                            // Mostra apenas uma mensagem global de erro
                            if (!this.processingCollects.has('error')) {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Erro de Coleta',
                                    detail: 'Erro ao finalizar algumas coletas. Tente novamente.',
                                });
                                this.processingCollects.add('error'); // Marca que a mensagem de erro foi exibida
                            }

                            this.processingCollects.delete(coleta.id!); // Libera a coleta para reprocessamento
                        },
                    });
                } else {
                    console.log(`Coleta ${coleta.id} não está em estado válido para conclusão.`);
                }
            }
        });
    }

    /**
     * Atualiza o marcador da localização do usuário.
     * @param location A localização atual do usuário.
     */
    updateUserLocationMarker(location: { lat: number; lng: number }): void {
        const userMarker: google.maps.MarkerOptions = {
            position: location,
            title: 'Sua Localização',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Ícone personalizado
                scaledSize: new google.maps.Size(40, 40), // Ajusta o tamanho do ícone
            },
        };
        this.userLocationMarker.next(userMarker);
    }


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
