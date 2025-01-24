import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {CollectorAndMapStateService} from "../../core/services/collector-and-map-state.service";
import {combineLatest} from "rxjs";
import {CommonModule} from "@angular/common";

interface MarkerInfo { // Interface para tipar as informações do marcador
    position: google.maps.LatLngLiteral;
    title: string;
    icon?: string;
    description: string; // Adicione uma descrição
    id:number;
}

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [
        CommonModule,
        GoogleMap,
        MapMarker
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit {
    center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    markers: google.maps.MarkerOptions[] = [];
    zoom = 15; // Nível de zoom inicial
    @ViewChild(GoogleMap, { static: false }) googleMap!: GoogleMap;

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

    ngAfterViewInit(): void {
        if (this.googleMap && this.googleMap.googleMap) {
            this.collectorAndMapStateService.setMapInstance(this.googleMap.googleMap);
        }
    }

    // openInfoWindow(marker: MapMarker, markerData: MarkerInfo) {
    //     this.infoWindow.open(marker);
    //     // Armazena os dados do marcador no infoWindow para serem usados no template
    //     (this.infoWindow as any)._component.context = { marker: markerData };
    //
    // }

    // openInfoWindow(marker: MapMarker) {
    //     this.infoWindow.open(marker);
    // }

    // /**
    //  * Ação ao clicar no marcador.
    //  * @param mapMarker O elemento `MapMarker` clicado.
    //  * @param infoWindow O elemento `MapInfoWindow` associado.
    //  */
    // onMarkerClick(mapMarker: MapMarker, infoWindow: MapInfoWindow): void {
    //     console.log('Marcador clicado:', mapMarker); // TODO remover
    //
    //     if (infoWindow) {
    //         infoWindow.open(mapMarker); // Passa corretamente o MapMarker
    //     } else {
    //         console.error('InfoWindow não associado corretamente ao marcador.');
    //     }
    // }
}
