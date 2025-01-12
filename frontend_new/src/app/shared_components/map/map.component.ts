import {Component, OnInit} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";

@Component({
  selector: 'app-map',
  standalone: true,
    imports: [
        GoogleMap
    ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {

    center: google.maps.LatLngLiteral = { lat: -23.55052, lng: -46.633308 }; // Coordenadas de São Paulo
    zoom = 12; // Nível de zoom inicial

    // map: google.maps.Map | undefined;
    // markers: google.maps.Marker[] = [];
    // directionsService: google.maps.DirectionsService | undefined;
    // directionsRenderer: google.maps.DirectionsRenderer | undefined;
    //
    // ngOnInit(): void {
    //     this.initMap();
    // }
    //
    // // Inicializa o mapa
    // initMap(): void {
    //     const mapOptions: google.maps.MapOptions = {
    //         center: { lat: -23.55052, lng: -46.633308 }, // Coordenadas de exemplo (São Paulo)
    //         zoom: 12,
    //     };
    //
    //     this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    //
    //     // Inicializa serviços de rotas
    //     this.directionsService = new google.maps.DirectionsService();
    //     this.directionsRenderer = new google.maps.DirectionsRenderer();
    //     this.directionsRenderer.setMap(this.map);
    //
    //     // Adiciona marcadores de exemplo
    //     this.addMarker({ lat: -23.55052, lng: -46.633308 }, 'Ponto A');
    //     this.addMarker({ lat: -23.558, lng: -46.645 }, 'Ponto B');
    // }
    //
    // // Adiciona um marcador no mapa
    // addMarker(position: google.maps.LatLngLiteral, title: string): void {
    //     const marker = new google.maps.Marker({
    //         position,
    //         map: this.map,
    //         title,
    //     });
    //
    //     this.markers.push(marker);
    //
    //     // Adiciona evento ao clicar no marcador
    //     marker.addListener('click', () => {
    //         alert(`Marcador clicado: ${title}`);
    //     });
    // }
    //
    // // Traça uma rota entre dois pontos
    // createRoute(start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral): void {
    //     if (this.directionsService && this.directionsRenderer) {
    //         this.directionsService.route(
    //             {
    //                 origin: start,
    //                 destination: end,
    //                 travelMode: google.maps.TravelMode.DRIVING,
    //             },
    //             (result, status) => {
    //                 if (status === google.maps.DirectionsStatus.OK) {
    //                     this.directionsRenderer.setDirections(result);
    //                 } else {
    //                     console.error('Erro ao criar rota:', status);
    //                 }
    //             }
    //         );
    //     }
    // }
}
