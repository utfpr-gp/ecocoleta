import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {User, UserService} from "../../domains/user/user.service";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {WasteCollectorService} from "../../core/services/waste-collector.service";
import {Collect, CollectService, CollectStatus} from "../../domains/collect/collect.service";
import {LocationService} from "../../core/services/location.service";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {CommonModule} from '@angular/common';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {DialogModule} from "primeng/dialog";
import {MessageService} from "primeng/api";


@Component({
    selector: 'app-home-waste-collector',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        MapComponent,
        ProgressSpinnerModule,
        DialogModule,
    ],
    templateUrl: './home-waste-collector.component.html',
    styleUrl: './home-waste-collector.component.scss'
})
export class HomeWasteCollectorComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    user: User | null = null;
    isCollectingFlag$: Observable<boolean>;
    totalAvailableCollects = 0;
    loading$: Observable<boolean>;

    showModal: boolean = false; // Estado do modal
    progressCollects: Collect[] = []; // Coletas em progresso


    constructor(
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService,
        private wasteCollectorService: WasteCollectorService,
        private locationService: LocationService,
        private collectService: CollectService,
        private messageService: MessageService
    ) {
        // Obtém o estado reativo do serviço
        this.isCollectingFlag$ = this.collectorAndMapStateService.coletaStatus$;
        this.loading$ = this.collectorAndMapStateService.loading$;
    }

    ngOnInit(): void {

        // Inscrição ao usuário
        this.userService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => (this.user = user));

        this.isCollectingFlag$.pipe(
            takeUntil(this.destroy$),
            tap(isCollecting => {
                if (!isCollecting) {

                    console.log('Verificando coletas em progresso...');
                    this.collectorAndMapStateService.checkProgressCollects().subscribe((progressCollects) => {
                        if (progressCollects.length > 0) {
                            this.progressCollects = progressCollects;
                            this.showModal = true; // Exibe o modal
                        } else {
                            this.initializeUnlinkedCollects(); // Nenhuma coleta em progresso
                        }
                    });

                } else {
                    this.collectorAndMapStateService.resumeInProgressCollects();
                }
            })
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeUnlinkedCollects(): void {
        this.locationService.getCurrentLocation().then(position => {
            // Centraliza o mapa na localização do usuário
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};
            this.collectorAndMapStateService.setMapCenter(location);
            this.collectorAndMapStateService.setLocation(location);

            // Atualiza o marcador da localização do usuário
            this.collectorAndMapStateService.updateUserLocationMarker(location);

            this.wasteCollectorService.updateWasteCollectorLocation({
                wasteCollectorId: this.user.id,
                latitude: location.lat,
                longitude: location.lng,
            }).subscribe();

            this.collectService.getUnlinkedCollects(location.lng, location.lat).subscribe(collects => {
                this.totalAvailableCollects = collects.length;

                const markers = this.generateMarkers(collects);
                this.collectorAndMapStateService.setMapMarkers(markers);
            });
        });
    }

    private generateMarkers(collects: any[]): google.maps.MarkerOptions[] {
        const markerPositions = new Set<string>();
        return collects.map(c => {
            let {latitude, longitude} = c;
            while (markerPositions.has(`${latitude},${longitude}`)) {
                latitude += 0.00001;
                longitude += 0.00005;
            }
            markerPositions.add(`${latitude},${longitude}`);
            return {
                position: {lat: latitude, lng: longitude},
                title: `Coleta ${c.id}`,
                description: `Status: ${c.status}`, // Informações adicionais
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: 'green',
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: 'darkgreen'
                }
            };
        });
    }

    handleModalAction(action: 'resume' | 'reset'): void {
        this.showModal = false; // Fecha o modal

        if (action === 'resume') {
            console.log('Retomando coletas em progresso...');
            this.collectorAndMapStateService.resumeInProgressCollects();
            // this.progressCollects = [];
        } else if (action === 'reset') {
            console.log('Resetando coletas em progresso...');
            const user = this.collectorAndMapStateService.getCurrentUser();
            if (user?.id) {
                this.collectService.resetCollects(user.id).subscribe({
                    next: () => {
                        this.collectorAndMapStateService.setColetasData([]);
                        console.log('Coletas resetadas com sucesso.');
                    },
                    error: (err) => {
                        console.error('Erro ao resetar coletas:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível resetar as coletas. Por favor, tente novamente.',
                            life: 3000
                        });
                    },
                });
            }
            // TOOD colocar spiiner aqui ou dentro do initializeunliunk...
            this.initializeUnlinkedCollects();
        }
    }


}
