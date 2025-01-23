import {Injectable} from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, Observable} from 'rxjs';
import {LocationService} from './location.service';
import {Collect, CollectService, CollectStatus} from '../../domains/collect/collect.service';
import {WasteCollectorService} from "./waste-collector.service";
import {MessageService} from "primeng/api";
import {User, UserRole, UserService} from "../../domains/user/user.service";

/*
* fazer o footer se comunicar com o home-waste */

@Injectable({
    providedIn: 'root',
})
export class CollectorAndMapStateService {
    private currentUser = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUser.asObservable();
    // Estado das coletas e do mapa
    private coletaStatus = new BehaviorSubject<boolean>(false);
    coletaStatus$ = this.coletaStatus.asObservable().pipe(distinctUntilChanged());

    private coletaData = new BehaviorSubject<Collect[]>([]);
    private mapMarkers = new BehaviorSubject<google.maps.MarkerOptions[]>([]);
    mapMarkers$ = this.mapMarkers.asObservable();

    private directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false, // Permitir marcadores padrão
    });
    //Teste marcador user
    private userLocationMarker = new BehaviorSubject<google.maps.MarkerOptions | null>(null);
    userLocationMarker$ = this.userLocationMarker.asObservable();

    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
    private mapCenter = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
    mapCenter$ = this.mapCenter.asObservable();

    private mapZoom = new BehaviorSubject<number>(15);

    private processingCollects: Set<string> = new Set();

    constructor(
        private locationService: LocationService,
        private collectService: CollectService,
        private userService: UserService,
        private messageService: MessageService,
        private wasteCollectorService: WasteCollectorService
    ) {
        // Observar o usuário atual do UserService
        this.userService.user$.subscribe((user) => {
            this.currentUser.next(user);
        });
    }

    //*--------------------------- Gerenciar estados -----------------------------------*//
    /**
     * Obtém o usuário atual diretamente (sincronicamente).
     */
    getCurrentUser(): User | null {
        return this.currentUser.getValue();
    }

    setMapInstance(map: google.maps.Map): void {
        this.directionsRenderer.setMap(map);
    }

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

                    // Atualiza o estado com as coletas
                    this.coletaData.next(coletas);

                    // Define a localização do usuário
                    this.setLocation(location);

                    // Gera a rota com base nas coletas e na localização atual
                    this.generateRoute();

                    // comentado para testar gerar rota
                    // const markers = coletas.map((coleta) => ({
                    //     position: {lat: coleta.latitude!, lng: coleta.longitude!},
                    //     title: `Coleta ${coleta.id}`,
                    // }));
                    // this.mapMarkers.next(markers);

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
            this.updateUserLocationMarker(location);

            console.log('Nova localização monitorada:', location); // TODO REMOVER

            // Verifica proximidade com coletas (opcional)
            this.checkProximity(location);
        });
    }

    /**
     * Para o monitoramento de localização.
     */
    stopLocationMonitoring(): void {
        console.log('Parando monitoramento de localização...'); // TODO REMOVER
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
                                c.id === coleta.id ? {...c, status: 'COMPLETED'} : c
                            );
                            this.setColetasData(updatedColetas as Collect[]);
                            this.processingCollects.delete(coleta.id!); // Libera a coleta após o sucesso

                            // Atualiza a localização do catador
                            const user = this.getCurrentUser();
                            this.wasteCollectorService.updateWasteCollectorLocation({
                                wasteCollectorId: user.id,
                                latitude: location.lat,
                                longitude: location.lng,
                            }).subscribe();

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
        const user = this.getCurrentUser();
        if (user?.role === UserRole.WASTE_COLLECTOR) {
            const userMarker: google.maps.MarkerOptions = {
                position: location,
                title: 'Sua Localização',
                // icon: {
                //     url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                //     scaledSize: new google.maps.Size(40, 40),
                // },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10, // Tamanho do círculo
                    fillColor: 'blue', // Cor de preenchimento
                    fillOpacity: 1, // Opacidade do preenchimento
                    strokeWeight: 1, // Espessura do contorno
                    strokeColor: 'darkblue' // Cor do contorno
                }
            };
            this.userLocationMarker.next(userMarker);
            console.log('userLocationMarker: ', userMarker); // TODO REMOVER
        } else {
            console.log('Não exibe marcador de localização para usuário não WasteCollector.'); // TODO REMOVER
            this.userLocationMarker.next(null); // Não exibe marcador se não for WasteCollector
        }
    }

    generateRoute(): void {
        const userLocation = this.location.getValue();
        if (!userLocation) {
            console.error('Localização do usuário não disponível.');
            return;
        }

        const coletas = this.coletaData.getValue();
        if (coletas.length < 1) {
            console.warn('Pontos insuficientes para gerar uma rota.');
            return;
        }

        // TODO pegar lista de coletas e excluir as que ja foram coletadas com status completed

        const waypoints = coletas.map((coleta) => ({
            location: {lat: coleta.latitude!, lng: coleta.longitude!},
            stopover: true,
        }));

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: userLocation,
                destination: waypoints[waypoints.length - 1].location,
                waypoints: waypoints.slice(0, -1),
                travelMode: google.maps.TravelMode.WALKING,
                optimizeWaypoints: true,
                language: 'pt_BR', // Idioma da rota
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.directionsRenderer.setDirections(result);

                    // Ajustar o mapa para exibir toda a rota
                    const bounds = new google.maps.LatLngBounds();
                    result.routes[0].legs.forEach((leg) => {
                        bounds.extend(leg.start_location);
                        bounds.extend(leg.end_location);
                    });
                    this.directionsRenderer.getMap()?.fitBounds(bounds);
                    console.log('Rota gerada com sucesso:', result);
                } else {
                    console.error('Falha ao gerar a rota:', status);
                }
            }
        );
    }

//     TODO quand oa rota ou a aproximação estiver na ultima coleta tem que finaliza e mandar para o back, zerar os pontos e parar de monitorar a localização
}
