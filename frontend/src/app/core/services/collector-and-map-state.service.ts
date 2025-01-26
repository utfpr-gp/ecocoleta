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

    // Localização e marcadores do mapa
    private location = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
    private locationWatchId: number | null = null; // Controla o ID do monitoramento localmente
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
        /// se status de coleta for false inicia coleta
        if (!this.coletaStatus.getValue()) {
            // Define o status de coleta como ativo
            this.coletaStatus.next(true);
            
            this.setLoading(true); // Ativar o spinner

            // Obter a localização atual do usuário
            this.locationService.getCurrentLocation().then((position) => {
                const location = {lat: position.coords.latitude, lng: position.coords.longitude};

                // Define a localização do usuário
                this.setLocation(location);

                // Obter as coletas e reservar para o coletor
                this.collectService.getReservedCollects(collectorId, location.lng, location.lat).subscribe({
                    next: (coletas) => {
                        console.log('START COLETAS --- Coletas disponíveis:', coletas);
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

                        // Gera a rota com base nas coletas e na localização atual
                        this.generateRoute();

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
                            detail: 'Erro ao iniciar a coleta: ' + err?.message,
                        });
                        this.setLoading(false); // Desativar o spinner
                    },
                });
            });
        }
    }

    /**
     * Para a coleta e o monitoramento de localização.
     */
    stopCollection(): void {
        // Adiciona spinner loading (caso necessário)
        // TODO: Implement spinner logic
        this.setLoading(true); // Ativar o spinner

        if (this.coletaStatus.getValue()) {
            const user = this.getCurrentUser();

            // Resetar as coletas associadas ao catador no backend
            if (user?.id) {
                this.collectService.resetCollects(user.id).subscribe({
                    next: () => {
                        console.log('Coletas associadas resetadas com sucesso no backend.');
                        this.finalizeAllCollects('cancelled'); // Reutiliza o método genérico
                        this.setLoading(false); // Desativa o spinner após o sucesso
                    },
                    error: (err) => {
                        console.error('Erro ao resetar coletas:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro ao Resetar Coletas',
                            detail: 'Não foi possível resetar as coletas. Por favor, tente novamente.',
                        });
                        this.setLoading(false); // Desativa o spinner após o sucesso
                    },
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Usuário Não Identificado',
                    detail: 'Não foi possível identificar o usuário para resetar as coletas.',
                });
                this.setLoading(false); // Desativa o spinner após o sucesso
            }
        } else {
            // Mensagem para quando não há coleta ativa
            this.messageService.add({
                severity: 'info',
                summary: 'Nenhuma Coleta Ativa',
                detail: 'Não há nenhuma coleta em andamento para ser finalizada.',
            });
            this.setLoading(false); // Desativa o spinner após o sucesso
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

        console.log('Resumindo coletas em andamento...'); // TODO REMOVER

        this.setLoading(true); // Ativar spinner

        this.locationService.getCurrentLocation().then((position) => {
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};

            console.log('resume collecting Localização atual:', location); // TODO REMOVER

            // Centraliza o mapa na localização do usuário
            this.setMapCenter(location);
            this.setLocation(location);
            this.updateUserLocationMarker(location);

            console.log('resume collecting Localização do usuário atualizada no mapa.'); // TODO REMOVER

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

                                // Define o estado de coleta como ativo
                                this.coletaStatus.next(true);

                                // Atualiza os dados de coleta e reinicia a rota
                                this.setColetasData(inProgressCollects);
                                this.generateRoute();
                                // TODO aqui não esta gerando rota

                                // Reinicia o monitoramento de localização
                                this.startLocationMonitoring();

                                this.setLoading(false); // Desativar spinner

                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Coleta Retomada',
                                    detail: 'As coletas em andamento foram retomadas.',
                                    life: 5000,
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
                                life: 5000,
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

    //*--------------------------- Gerenciar localização -----------------------------------*//

    /**
     * Inicia o monitoramento de localização.
     */
    startLocationMonitoring(): void {
        if (this.locationWatchId !== null) {
            console.warn('Monitoramento de localização já está ativo.');
            return; // Impede que múltiplos watchers sejam iniciados
        }

        console.log('Iniciando monitoramento de localização...');
        this.locationWatchId = this.locationService.watchLocation(
            (position) => {
                const location = {lat: position.coords.latitude, lng: position.coords.longitude};
                this.location.next(location);

                // Atualiza o marcador da localização do usuário
                this.updateUserLocationMarker(location);

                console.log('Nova localização monitorada:', location); // TODO REMOVER

                // Verifica proximidade com coletas (opcional)
                this.checkProximity(location);
            },
            (error) => {
                //TODO adicionar menssagem de erro???
                console.error('Erro no monitoramento de localização:', error);
            }
        );
    }

    /**
     * Para o monitoramento de localização.
     */
    stopLocationMonitoring(): void {
        console.log('Parando monitoramento de localização...');
        this.locationService.clearWatch(); // Para o monitoramento no serviço

        // Reseta o ID local para indicar que o monitoramento foi parado
        this.locationWatchId = null;
    }

    /**
     * Verifica proximidade com as coletas.
     */
    private checkProximity(location: { lat: number; lng: number }): void {
        console.log('Verificando proximidade...', location);

        const coletas = this.coletaData.getValue(); // Obtem o array atual de coletas
        console.log('checkProximity Coletas array coletasData: ', coletas); // TODO REMOVER

        const threshold = 30; // Distância limite em metros (30 metros)

        let todasConcluidas = true;

        coletas.forEach((coleta) => {
            // Calcula a distância utilizando a fórmula de Haversine para maior precisão

            const distance = this.calculateHaversineDistance(location, {lat: coleta.latitude, lng: coleta.longitude});
            console.log('foreach Coleta:', coleta); // TODO REMOVER

            console.log(`Coleta ID ${coleta.id}: distância calculada = ${distance} metros`); // TODO REMOVER

            // TODO verificar distancia não esta correto !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            // Verifica se a coleta está próxima e ainda não foi processada
            if (distance <= threshold && coleta.status !==  "COMPLETED") {
                console.log(`Coleta ${coleta.id} está próxima. Verificando status...`);

                // Processa a coleta caso esteja em estado válido
                if (coleta.status === "PENDING" || coleta.status === "IN_PROGRESS") {
                    this.finalizeCollect(coleta, location);
                } else {
                    console.log(`Coleta ${coleta.id} não está em estado processável (status: ${coleta.status}).`);
                }
            }

            // Verifica se todas as coletas foram concluídas, caso todas estejam concluídas, não muda valor da variável e entra no próximo if para finalizar a coleta
            if (coleta.status !== "COMPLETED") {
                todasConcluidas = false;
            }
        });

        // Caso todas as coletas estejam finalizadas, dispara o encerramento geral
        if (todasConcluidas) {
            // this.finalizeAllCollects();
            this.finalizeAllCollects('completed');
        }
    }

    private finalizeCollect(coleta: Collect, location: { lat: number; lng: number }): void {
        console.log(`Finalizando coleta ${coleta.id}...`);

        this.collectService.finalizeColeta(coleta).subscribe({
            next: () => {
                // Atualiza o status da coleta localmente
                const updatedColetas = this.coletaData.getValue().map((c) =>
                    c.id === coleta.id ? {...c, status: CollectStatus.COMPLETED} : c
                );
                this.setColetasData(updatedColetas as Collect[]);

                // Atualiza a localização do catador
                const user = this.getCurrentUser();
                this.wasteCollectorService.updateWasteCollectorLocation({
                    wasteCollectorId: user.id,
                    latitude: location.lat,
                    longitude: location.lng,
                }).subscribe();

                console.log(`Coleta ${coleta.id} finalizada com sucesso.`);
                this.showSuccessMessage(`Coleta ${coleta.id} foi marcada como concluída.`);
            },
            error: (error) => {
                console.error(`Erro ao finalizar coleta ${coleta.id}:`, error);
                this.showErrorMessage(`Erro ao finalizar coleta ${coleta.id}. Tente novamente.`);
            },
        });
    }

    private finalizeAllCollects(reason: 'completed' | 'cancelled'): void {
        console.log(`Finalizando todas as coletas. Motivo: ${reason === 'completed' ? 'Concluído' : 'Cancelado'}`);

        // Para o monitoramento de localização
        this.stopLocationMonitoring();

        // Limpa as coletas no estado local
        this.coletaData.next([]);
        this.coletaStatus.next(false);

        // Cancela rotas ativas no mapa, se houver
        if (this.directionsRenderer.getDirections()) {
            this.cancelRoute();
        }

        // Exibe mensagens apropriadas com base no motivo
        const messages = {
            completed: {
                summary: 'Coleta Completa',
                detail: 'Todas as coletas foram concluídas com sucesso.',
            },
            cancelled: {
                summary: 'Coleta Cancelada',
                detail: 'Todas as coletas em andamento foram canceladas.',
            },
        };

        this.messageService.add({
            severity: 'success',
            summary: messages[reason].summary,
            detail: messages[reason].detail,
        });
    }

    //*--------------------------- Gerenciar rota -----------------------------------*//

    private calculateHaversineDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
        const R = 6371e3; // Raio da Terra em metros
        const lat1 = (loc1.lat * Math.PI) / 180; // Convertendo latitude de loc1 para radianos
        const lat2 = (loc2.lat * Math.PI) / 180; // Convertendo latitude de loc2 para radianos
        const deltaLat = ((loc2.lat - loc1.lat) * Math.PI) / 180; // Diferença de latitude em radianos
        const deltaLng = ((loc2.lng - loc1.lng) * Math.PI) / 180; // Diferença de longitude em radianos

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distância em metros
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
    }

    //*--------------------------- Mensagens -----------------------------------*//
    private showSuccessMessage(detail: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            life: 5000,
            detail,
        });
    }

    private showErrorMessage(detail: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            life: 5000,
            detail,
        });
    }
}
