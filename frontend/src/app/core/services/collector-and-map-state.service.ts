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
    // Usuário atual
    private currentUser = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUser.asObservable();

    // Estado das coletas
    private coletaStatus = new BehaviorSubject<boolean>(false);
    coletaStatus$ = this.coletaStatus.asObservable().pipe(distinctUntilChanged());
    private coletaData = new BehaviorSubject<Collect[]>([]);
    private processingCollects: Set<string> = new Set();

    // Localização e marcadores do mapa
    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
    private mapMarkers = new BehaviorSubject<google.maps.MarkerOptions[]>([]);
    mapMarkers$ = this.mapMarkers.asObservable();
    private directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false, // Permitir marcadores padrão
    });
    private userLocationMarker = new BehaviorSubject<google.maps.MarkerOptions | null>(null);
    userLocationMarker$ = this.userLocationMarker.asObservable();
    private mapCenter = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
    mapCenter$ = this.mapCenter.asObservable();
    private mapZoom = new BehaviorSubject<number>(15);

    // Loading
    private loading = new BehaviorSubject<boolean>(false);
    loading$ = this.loading.asObservable();

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

    /**
     * Ativa o estado de carregamento.
     */
    setLoading(isLoading: boolean): void {
        this.loading.next(isLoading);
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
            this.setLoading(true); // Ativar o spinner

            this.locationService.getCurrentLocation().then((position) => {
                const location = {lat: position.coords.latitude, lng: position.coords.longitude};
                this.collectService.getReservedCollects(collectorId, location.lng, location.lat).subscribe({
                    next: (coletas) => {
                        if (coletas.length === 0) {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Nenhuma Coleta Disponível',
                                detail: 'Não há coletas disponíveis para iniciar.',
                                life: 5000,
                            });
                            this.setLoading(false); // Desativar o spinner
                            return;
                        }

                        // Atualiza o estado com as coletas
                        this.coletaData.next(coletas);

                        // Define a localização do usuário
                        this.setLocation(location);

                        // Gera a rota com base nas coletas e na localização atual
                        this.generateRoute();

                        // Define o status de coleta como ativo
                        this.coletaStatus.next(true);

                        // Inicia o monitoramento de localização
                        this.startLocationMonitoring();

                        console.log('Coleta iniciada com sucesso!');
                        this.setLoading(false); // Desativar o spinner
                    },
                    error: (err) => {
                        console.error('Erro ao iniciar coleta:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao iniciar a coleta. Tente novamente.',
                        });
                        this.setLoading(false); // Desativar o spinner
                    },
                });
            });
        }
    }

    /**
     * Retoma as coletas em andamento.
     * */
    resumeInProgressCollects(): void {
        const user = this.getCurrentUser();
        if (!user?.id) {
            console.warn('Usuário não identificado. Não é possível verificar coletas em andamento.');
            return;
        }

        this.setLoading(true); // Ativar spinner

        this.locationService.getCurrentLocation().then((position) => {
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};

            // Centraliza o mapa na localização do usuário
            this.setMapCenter(location);
            this.setLocation(location);
            this.updateUserLocationMarker(location);

            // Atualiza a localização no backend
            this.wasteCollectorService.updateWasteCollectorLocation({
                wasteCollectorId: user.id,
                latitude: location.lat,
                longitude: location.lng,
            }).subscribe({
                next: () => {
                    console.log('Localização do usuário atualizada no backend.');

                    // Busca coletas em progresso
                    this.collectService.getCollectsByStatus(user.id, CollectStatus.IN_PROGRESS).subscribe({
                        next: (inProgressCollects) => {
                            if (inProgressCollects.length > 0) {
                                console.log('Coletas em andamento encontradas:', inProgressCollects);

                                // Atualiza os dados de coleta e reinicia a rota
                                this.setColetasData(inProgressCollects);
                                this.generateRoute();
                                // TODO aqui não esta gerando rota

                                // Define o estado de coleta como ativo
                                this.coletaStatus.next(true);

                                // Reinicia o monitoramento de localização
                                this.startLocationMonitoring();

                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Coleta Retomada',
                                    detail: 'As coletas em andamento foram retomadas.',
                                });
                            } else {
                                console.log('Nenhuma coleta em andamento encontrada para o usuário.');
                            }
                            this.setLoading(false); // Desativar spinner
                        },
                        error: (err) => {
                            console.error('Erro ao buscar coletas em andamento:', err);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro',
                                detail: 'Erro ao verificar coletas em andamento. Tente novamente.',
                            });
                            this.setLoading(false); // Desativar spinner
                        },
                    });
                },
                error: (err) => {
                    console.error('Erro ao atualizar localização no backend:', err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Erro ao atualizar localização. Tente novamente.',
                    });
                    this.setLoading(false); // Desativar spinner
                },
            });
        });
    }


    checkProgressCollects(): Observable<Collect[]> {
        const user = this.getCurrentUser();
        if (!user?.id) {
            return new Observable<Collect[]>(); // Retorna vazio
        }

        return this.collectService.getCollectsByStatus(user.id, CollectStatus.IN_PROGRESS);
    }


    /**
     * Para a coleta e o monitoramento de localização.
     */
    stopCollection(): void {
        // TODO add spinner loading
        if (this.coletaStatus.getValue()) {
            const user = this.getCurrentUser();

            // Resetar as coletas associadas ao catador no backend
            if (user?.id) {
                this.collectService.resetCollects(user.id).subscribe({
                    next: () => {
                        // this.messageService.add({
                        //     severity: 'success',
                        //     summary: 'Coletas Resetadas',
                        //     detail: 'As coletas associadas foram resetadas com sucesso.',
                        // });
                    },
                    error: (err) => {
                        console.error('Erro ao resetar coletas:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro ao Resetar Coletas',
                            detail: 'Não foi possível resetar as coletas. Por favor, tente novamente.',
                        });
                    },
                });

                this.coletaStatus.next(false);
                this.coletaData.next([]); // Limpa os dados de coleta

                // Verifica se há uma rota ativa no mapa e cancela
                if (this.directionsRenderer.getDirections()) {
                    this.cancelRoute();
                }

                // Para o monitoramento de localização
                this.stopLocationMonitoring();

                this.messageService.add({
                    severity: 'success',
                    summary: 'Coleta Finalizada',
                    detail: 'Todas as operações de coleta foram encerradas com sucesso.',
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Usuário Não Identificado',
                    detail: 'Não foi possível identificar o usuário para resetar as coletas.',
                });
            }
        } else {
            // Mensagem para quando não há coleta ativa
            this.messageService.add({
                severity: 'info',
                summary: 'Nenhuma Coleta Ativa',
                detail: 'Não há nenhuma coleta em andamento para ser finalizada.',
            });
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
                    if (this.isLastCollect(coleta)) {
                        this.finalizeLastCollect(); // Finaliza automaticamente a última coleta
                        this.stopLocationMonitoring();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Coleta Completa',
                            detail: 'Todas as coletas foram concluídas.',
                        });
                    } else {

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
                    }
                } else {
                    console.log(`Coleta ${coleta.id} não está em estado válido para conclusão.`);
                }
            }
        });
    }

    private isLastCollect(collect: Collect): boolean {
        const coletas = this.coletaData.getValue();
        return coletas[coletas.length - 1]?.id === collect.id;
    }

    finalizeLastCollect(): void {
        const coletas = this.coletaData.getValue();

        if (coletas.length === 0) {
            console.warn('Nenhuma coleta em andamento para finalizar.');
            return;
        }

        const lastCollect = coletas[coletas.length - 1]; // Última coleta

        if (lastCollect.status === CollectStatus.IN_PROGRESS) {
            this.collectService.finalizeColeta(lastCollect).subscribe({
                next: () => {
                    console.log(`Coleta ${lastCollect.id} finalizada com sucesso.`);

                    // Atualiza o estado para refletir que a coleta foi finalizada
                    this.setColetasData(coletas.filter((c) => c.id !== lastCollect.id));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Coleta Finalizada',
                        detail: `A última coleta (ID: ${lastCollect.id}) foi finalizada com sucesso.`,
                    });
                },
                error: (err) => {
                    console.error(`Erro ao finalizar a coleta ${lastCollect.id}:`, err);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: `Erro ao finalizar a coleta (ID: ${lastCollect.id}). Tente novamente.`,
                    });
                },
            });
        } else {
            console.warn('A última coleta não está em estado IN_PROGRESS e não pode ser finalizada.');
        }
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
        } else {
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

    /**
     * Cancela a rota atual e reseta o estado do mapa.
     */

    // cancelRoute(): void {
    //     console.log('CANCELANDO ROTA....');
    //     const directions = this.directionsRenderer.getDirections();
    //     if (directions) {
    //         console.log('Tem diretions Removendo rota:', directions);
    //     }
    //
    //     // Verificar se há um mapa vinculado
    //     if (this.directionsRenderer.getMap()) {
    //         this.directionsRenderer.setDirections(null); // Remove a rota
    //         console.log('Rota removida do mapa com sucesso.');
    //     } else {
    //         console.warn('Nenhum mapa vinculado ao DirectionsRenderer.');
    //     }
    //
    //     // Resetar marcadores e estado do mapa
    //     this.clearMapMarkers();
    //     this.setMapZoom(15);
    //     this.setMapCenter(null);
    //
    //     console.log('Mapa redefinido com sucesso.');
    // }

    cancelRoute(): void {
        // Verificar se há um mapa vinculado antes de limpar as direções
        if (this.directionsRenderer.getMap()) {
            try {
                this.directionsRenderer.setDirections({routes: []} as google.maps.DirectionsResult); // Remove as rotas
                console.log('Rota removida do mapa com sucesso.'); //todo remover
            } catch (error) {
                console.error('Erro ao remover rota:', error); //todo remover
            }
        } else {
            console.warn('Nenhum mapa vinculado ao DirectionsRenderer.');
        }

        // Resetar marcadores e estado do mapa
        this.clearMapMarkers();
        // this.setMapZoom(15);
        // this.setMapCenter(null);
    }


//     TODO quand oa rota ou a aproximação estiver na ultima coleta tem que finaliza e mandar para o back, zerar os pontos e parar de monitorar a localização
}
