import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {User, UserRole, UserService} from "../../domains/user/user.service";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {WasteCollectorService} from "../../core/services/waste-collector.service";
import {CollectService} from "../../domains/collect/collect.service";
import {LocationService} from "../../core/services/location.service";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {CommonModule} from '@angular/common';


@Component({
    selector: 'app-home-waste-collector',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        MapComponent,
    ],
    templateUrl: './home-waste-collector.component.html',
    styleUrl: './home-waste-collector.component.scss'
})
export class HomeWasteCollectorComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    user: User | null = null;
    isCollectingFlag$: Observable<boolean>;
    totalAvailableCollects = 0;

    constructor(
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService,
        private wasteCollectorService: WasteCollectorService,
        private locationService: LocationService,
        private collectService: CollectService
    ) {
        // Obtém o estado reativo do serviço
        this.isCollectingFlag$ = this.collectorAndMapStateService.coletaStatus$;
    }

    ngOnInit(): void {
        //TODO AO INICIAR O COMPONENTE VERIFICAR SE TEM NO BANCO UMA COLETA EM ANDAMENTO E SE TIVER INICIAR O MONITORAMENTO DA LOCALIZAÇÃO E INSERE NO MAPA...
        console.log('HomeWasteCollectorComponent initialized'); // todo remove
        console.log('HOME WASTE - ONINIT - GET-coletaStatus:', this.isCollectingFlag$); // todo remove

        // Inscrição ao usuário
        this.userService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => (this.user = user));

        this.isCollectingFlag$.pipe(
            takeUntil(this.destroy$),
            tap(isCollecting => {
                if (isCollecting) {
                    console.log('HOME WASTE - ONINIT - Coleta em andamento. Monitorando localização...');
                    console.log('Coleta em andamento. Monitorando localização...');
                    // this.startLocationMonitoring();
                } else {
                    console.log('HOME WASTE - ONINIT - Nenhuma coleta ativa. Buscando coletas disponíveis...');
                    console.log('Nenhuma coleta ativa. Buscando coletas disponíveis...');
                    this.initializeUnlinkedCollects();
                }
            })
        ).subscribe();

        console.log('HomeWasteCollectorComponent initialized FIM'); // todo remove
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        console.log('HomeWasteCollectorComponent destruído');
    }

    private initializeUnlinkedCollects(): void {
        this.locationService.getCurrentLocation().then(position => {
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};
            this.collectorAndMapStateService.setMapCenter(location);
            this.collectorAndMapStateService.setLocation(location);

            this.collectService.getUnlinkedCollects(location.lng, location.lat).subscribe(collects => {
                this.totalAvailableCollects = collects.length;
                const markers = this.generateMarkers(collects);
                this.collectorAndMapStateService.setMapMarkers(markers);
                console.log('Coletas disponíveis - PENDING: ', collects); // TODO: Remover
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
            };
        });
    }


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
