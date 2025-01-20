import {Component, OnInit} from '@angular/core';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        GoogleMap,
        MapMarker,
        NgForOf
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
    center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    markers: google.maps.MarkerOptions[] = [];
    zoom = 15; // Nível de zoom inicial

    constructor(
        private collectorAndMapStateService: CollectorAndMapStateService
    ) {
    }

    ngOnInit(): void {

        console.log('MapComponent initialized'); // todo remove

        // Observar o estado do centro do mapa
        this.collectorAndMapStateService.mapCenter$.subscribe((center) => {
            if (center) this.center = center;
        });

        // Observar os marcadores no mapa
        this.collectorAndMapStateService.mapMarkers$.subscribe((markers) => {
            this.markers = markers;
        });

        console.log('MapComponent initialized FIM'); // todo remove

    }
}
