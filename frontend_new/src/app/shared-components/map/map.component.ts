import {Component, OnDestroy, OnInit} from '@angular/core';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {LocationService} from "../../core/services/location.service";
import {CollectorStateService} from "../../domains/collect/collector-state.service";
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
export class MapComponent implements OnInit, OnDestroy {
    // TODO criar service map (inserir localização,)
    // TODO criar service no core global de para localização do dispositivo (mandar localização)
    // TODO criar service fazer um service ou status global da coletas algo assim para se usuario catador trocar de tela não fechar a coleta em andamento no mapa.
    //fluxo geral catador
    // ao iniciar o app, o app deve pegar a localização do dispositivo e mandar para o servidor
    // ao clicar em iniciar o servidor deve retornar as coletas mais proximas
    // o app deve mostrar as coletas no mapa e mrota para a coleta mais proxima
    // ao chegar na coleta o app deve mandar ao back que chegou na coleta (a cada 30 segundos verificar localização atual com a lista de coletas e sua localização)
    // ao finalizar a coleta o app deve mandar ao back que finalizou a coleta
    // ao finalizar a coleta o app deve pegar a localização do dispositivo e mandar para o servidor

    //fluxo geral usuario
    // ao iniciar o app, o app deve pegar a localização dos catadores ativos e inserir no mapa

    center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
    markers: google.maps.MarkerOptions[] = [];
    zoom = 15; // Nível de zoom inicial

    constructor(
        private locationService: LocationService,
        private collectorStateService: CollectorStateService
    ) {
    }

    ngOnInit(): void {
        // Atualizar mapa com localização atual
        this.collectorStateService.location$.subscribe((location) => {
            if (location) {
                this.center = location;

                // Adicionar ou atualizar o marcador do usuário
                const userMarkerIndex = this.markers.findIndex((m) => m.title === 'Você');
                if (userMarkerIndex > -1) {
                    this.markers[userMarkerIndex] = {
                        ...this.markers[userMarkerIndex],
                        position: location,
                    };
                } else {
                    this.markers.push({
                        position: location,
                        title: 'Você',
                        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Ícone personalizado
                    });
                }
            }
        });

        // Adicionar marcadores das coletas
        this.collectorStateService.coletaData$.subscribe((data) => {
            this.markers = this.markers.filter((m) => m.title === 'Você'); // Manter apenas o marcador do usuário
            const coletaMarkers = data.map((coleta) => ({
                position: {lat: coleta.latitude, lng: coleta.longitude},
                title: `Coleta ${coleta.id}`,
            }));
            this.markers = [...this.markers, ...coletaMarkers];
        });
    }

    ngOnDestroy(): void {
        this.locationService.clearWatch();
    }

    private initUserLocation(): void {
        // Obtém a localização atual
        this.locationService.getCurrentLocation()
            .then((position) => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Envia a localização ao servidor
                // this.collectService.sendCurrentLocation(this.center).subscribe();

                // Monitora continuamente
                this.locationService.watchLocation((pos) => {
                    const location = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    console.log('Localização atual coletada:', location); // TODO REMOVER
                    // this.collectionService.sendCurrentLocation(location).subscribe();
                });
            })
            .catch((error) => {
                console.error('Erro ao obter localização:', error); // TODO REMOVER
            });
    }
}


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
// }
