import {Component, OnInit} from '@angular/core';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {NgForOf} from "@angular/common";
import {combineLatest} from "rxjs";

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
        // this.collectorAndMapStateService.mapMarkers$.subscribe((markers) => {
        //     this.markers = markers;
        // });

        //teste com marcador do user>>>
        // Combinar marcadores do mapa e o marcador do usuário
        combineLatest([
            this.collectorAndMapStateService.mapMarkers$, // Marcadores gerais
            this.collectorAndMapStateService.userLocationMarker$, // Marcador do usuário
        ]).subscribe(([mapMarkers, userMarker]) => {
            if (userMarker) {
                this.markers = [...mapMarkers, userMarker];
            } else {
                this.markers = mapMarkers;
            }
        });

        console.log('MapComponent initialized FIM'); // todo remove

    }

    // /**
    //  * Atualiza os marcadores exibidos no mapa.
    //  * @param markers Os marcadores a serem exibidos.
    //  */
    // private updateMapMarkers(markers: google.maps.MarkerOptions[]): void {
    //     // Limpa marcadores anteriores
    //     this.clearMarkers();
    //
    //     // Adiciona os novos marcadores ao mapa
    //     markers.forEach((marker) => {
    //         new google.maps.Marker({
    //             ...marker,
    //             map: this.map, // Referência ao objeto `google.maps.Map`
    //         });
    //     });
    // }
    //
    // private clearMarkers(): void {
    //     // Lógica para remover marcadores antigos do mapa, se necessário
    // }
}
