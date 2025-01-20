import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {User, UserRole, UserService} from "../../domains/user/user.service";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {WasteCollectorService} from "../../core/services/waste-collector.service";
import {CollectService} from "../../domains/collect/collect.service";

@Component({
    selector: 'app-home-waste-collector',
    standalone: true,
    imports: [
        ButtonModule,
        MapComponent,
    ],
    templateUrl: './home-waste-collector.component.html',
    styleUrl: './home-waste-collector.component.scss'
})
export class HomeWasteCollectorComponent implements OnInit, OnDestroy {
    user: User | null = null;
    coletaStatus: boolean = false; // Variável pública para acessar no template
    totalAvailableCollects = 0;

    constructor(
        private userService: UserService,
        private collectorAndMapStateService: CollectorAndMapStateService,
        private wasteCollectorService: WasteCollectorService,
        private collectService: CollectService
    ) {
    }
    // TODO verificar como deixar essa classse sempre ativa para não alterar o mapa etc
    ngOnInit(): void {

        console.log('HomeWasteCollectorComponent initialized'); // todo remove

        this.userService.user$.subscribe(user => {
            this.user = user;
        });

        if (this.user && this.user.role === UserRole.WASTE_COLLECTOR) {
            // Inicia o monitoramento da localização para WasteCollector
            this.collectorAndMapStateService.startLocationMonitoring(this.user.id);

            // Inscreve-se no coletaStatus$ e atualiza a variável local
            this.collectorAndMapStateService.coletaStatus$.subscribe(status => {
                this.coletaStatus = status;
            });

            // Observar a localização atual do usuário
            this.collectorAndMapStateService.location$.subscribe(location => {
                if (location) {

                    // Envia atualização de localização ao backend
                    this.wasteCollectorService.updateWasteCollectorLocation({
                        collectorId: this.user.id,
                        latitude: location.lat,
                        longitude: location.lng,
                    }).subscribe();

                    // Atualiza a localização do catador centralizando o mapa
                    this.collectorAndMapStateService.setMapCenter(location);

                    // Chamar o serviço para obter as coletas não vinculadas com base na localização
                    this.collectService.getUnlinkedCollects(location.lng, location.lat).subscribe((collects) => {

                        // Atualiza o número total de coletas disponíveis
                        this.totalAvailableCollects = collects.length;

                        console.log('getUnlinkedCollects - home wastecolector>> collects: ', collects); // TODO REMOVER

                        const markerPositions = new Set<string>(); // Para rastrear posições já usadas
                        const markers = collects.map((c, index) => {
                            let {latitude, longitude} = c;

                            // Se já existe um marcador na mesma posição, aplica um deslocamento
                            while (markerPositions.has(`${latitude},${longitude}`)) {
                                latitude += 0.00001; // Pequeno deslocamento na latitude
                                longitude += 0.00005; // Pequeno deslocamento na longitude
                            }

                            // Adiciona a nova posição ao conjunto
                            markerPositions.add(`${latitude},${longitude}`);

                            return {
                                position: {lat: latitude, lng: longitude},
                                title: `Coleta ${c.id}`,
                            };
                        });

                        console.log('Marcadores gerados:', markers); // TODO REMOVER

                        this.collectorAndMapStateService.setMapMarkers(markers);
                    });
                }
            });
        }
        console.log('HomeWasteCollectorComponent initialized FIM'); // todo remove

    }

    ngOnDestroy(): void {
        // Limpa o monitoramento da localização ao destruir o componente
        this.collectorAndMapStateService.stopLocationMonitoring();
    }
}
