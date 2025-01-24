import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {RouterLink} from "@angular/router";
import {LocationService} from "../../core/services/location.service";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {WasteCollectorService} from "../../core/services/waste-collector.service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-home-resident',
    standalone: true,
    imports: [
        ButtonModule,
        MapComponent,
        RouterLink
    ],
    templateUrl: './home-resident.component.html',
    styleUrl: './home-resident.component.scss'
})
export class HomeResidentComponent implements OnInit {

    constructor(
        private locationService: LocationService,
        private collectorAndMapStateService: CollectorAndMapStateService,
        private wasteCollectorService: WasteCollectorService,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        // Obtém a localização atual do residente
        this.locationService.getCurrentLocation().then((position) => {
            const location = {lat: position.coords.latitude, lng: position.coords.longitude};

            // Centraliza o mapa na localização do residente
            this.collectorAndMapStateService.setMapCenter(location);

            // Busca os catadores ativos e atualiza os marcadores no mapa
            this.loadActiveCollectors();
        });
    }

    /**
     * Busca os catadores ativos e atualiza os marcadores no mapa.
     */
    private loadActiveCollectors(): void {
        this.wasteCollectorService.getActiveCollectors().subscribe({
            next: (collectors) => {
                const markers = collectors.map((collector) => ({
                    position: {lat: collector.latitude, lng: collector.longitude},
                    title: `Catador ${collector.wasteCollectorId}`, // Título genérico para o marcador
                    // icon: {
                    //     url: 'assets/images/green-dot.png', // Caminho para o arquivo local
                    //     // url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // Ícone para catadores
                    //     scaledSize: new google.maps.Size(40, 40), // Ajusta o tamanho do ícone
                    // }
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10, // Tamanho do círculo
                        fillColor: 'green', // Cor de preenchimento
                        fillOpacity: 1, // Opacidade do preenchimento
                        strokeWeight: 1, // Espessura do contorno
                        strokeColor: 'darkgreen' // Cor do contorno
                    }
                }));

                // Atualiza os marcadores no mapa
                this.collectorAndMapStateService.setMapMarkers(markers);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro ao buscar catadores ativos',
                    detail: 'Não foi possível buscar os catadores ativos., Error: ' + error?.message,
                    life: 3000
                });
            }
        });
    }
}
