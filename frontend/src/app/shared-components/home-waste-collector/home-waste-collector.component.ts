import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {User, UserService} from "../../domains/user/user.service";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {WasteCollectorService} from "../../core/services/waste-collector.service";
import {CollectService} from "../../domains/collect/collect.service";
import {LocationService} from "../../core/services/location.service";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {CommonModule} from '@angular/common';
import {ProgressSpinnerModule} from "primeng/progressspinner";


@Component({
    selector: 'app-home-waste-collector',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        MapComponent,
        ProgressSpinnerModule,
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

    constructor(
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService,
        private wasteCollectorService: WasteCollectorService,
        private locationService: LocationService,
        private collectService: CollectService
    ) {
        // Obtém o estado reativo do serviço
        this.isCollectingFlag$ = this.collectorAndMapStateService.coletaStatus$;
        this.loading$ = this.collectorAndMapStateService.loading$;
    }

    ngOnInit(): void {

        //todo
        // > ENGENHARIA DE ROTA {
        //     > FINALIZAR COLETA E STATES NA ULTIMA PARADA PONTO
        //     > AO SAIR DA PAGINA E VOLTAR, E STATUS COLETING TRUE, CHAMA STARTINGCOLETA E FAZ ROTA COM COLETAS STATUS:INPROGRES
        //     > AO PERDER CONEXÃO FECHAR PAGINA  VER NO BANCO SE TEM COLETA EM PROGRESS COM O ID CATADOR CHAMAR STARTRCOLETA ETC REINICIAR ONDE PAROU A ROTA
        //     OK> AO DESLIGAR STOP COLETAS RESETAR AS COLETAS NÃO COMPLETADAS
        //     }
        console.log('HomeWasteCollectorComponent initialized'); // todo remove
        console.log('HOME WASTE - ONINIT - GET-coletaStatus:', this.isCollectingFlag$); // todo remove

        // Inscrição ao usuário
        this.userService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => (this.user = user));

        this.isCollectingFlag$.pipe(
            takeUntil(this.destroy$),
            tap(isCollecting => {
                if (!isCollecting) {
                    console.log('HOME WASTE - ONINIT - Nenhuma coleta ativa. Buscando coletas disponíveis...'); // todo remove
                    this.initializeUnlinkedCollects();
                } else {
                    //TODO mudar aqui para chamar o startcollectin
                    // dentro da startcollection validar a lista de coletas e iniciar onde parou...
                    // também dentro dela ja pega e inicia o monitoramento da localização
                    console.log('HOME WASTE - ONINIT - Coleta em andamento. Monitorando localização...'); // todo remove
                    this.collectorAndMapStateService.startLocationMonitoring();
                }
            })
        ).subscribe();

        console.log('HomeWasteCollectorComponent initialized FIM'); // todo remove
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

            console.log('HOME WASTE - initializeUnlinkedCollects - MARCANDO LOCAL USER - location: ', location); // todo remove
            // Atualiza o marcador da localização do usuário
            this.collectorAndMapStateService.updateUserLocationMarker(location);

            this.wasteCollectorService.updateWasteCollectorLocation({
                wasteCollectorId: this.user.id,
                latitude: location.lat,
                longitude: location.lng,
            }).subscribe();

            this.collectService.getUnlinkedCollects(location.lng, location.lat).subscribe(collects => {
                this.totalAvailableCollects = collects.length;

                // TODO mudar para gerar os pontos dentro da service e aqui so chama a service, na service gero e salvo os pontos
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
            // TODO add mais info para a janela de info do marcador
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
}
