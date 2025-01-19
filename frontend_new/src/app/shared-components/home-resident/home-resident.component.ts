import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {RouterLink} from "@angular/router";
import {LocationService} from "../../core/services/location.service";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {WasteCollectorService} from "../../core/services/waste-collector.service";

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
export class HomeResidentComponent implements OnInit{

    constructor(
        private locationService: LocationService,
        private collectorAndMapStateService: CollectorAndMapStateService,
        private wasteCollectorService: WasteCollectorService
    ) {}

    ngOnInit(): void {
        this.locationService.getCurrentLocation().then((position) => {
            const location = { lat: position.coords.latitude, lng: position.coords.longitude };
            this.collectorAndMapStateService.setMapCenter(location);

            // Buscar catadores ativos
            this.wasteCollectorService.getActiveCollectors().subscribe((collectors) => {
                const markers = collectors.map((c) => ({
                    position: { lat: c.latitude, lng: c.longitude },
                    title: `Catador ${c.collectorId}`,
                //     TODO mudar isso?? sem nada de info do catador
                }));
                this.collectorAndMapStateService.setMapMarkers(markers);
            });
        });
    }
}
