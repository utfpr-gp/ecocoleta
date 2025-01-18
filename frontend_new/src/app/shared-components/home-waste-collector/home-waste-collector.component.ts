import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {User, UserRole, UserService} from "../../domains/user/user.service";
import {LayoutService} from "../../layout/service/app.layout.service";
import {CollectorStateService} from "../../domains/collect/collector-state.service";
import {LocationService} from "../../core/services/location.service";

@Component({
    selector: 'app-home-waste-collector',
    standalone: true,
    imports: [
        ButtonModule,
        MapComponent
    ],
    templateUrl: './home-waste-collector.component.html',
    styleUrl: './home-waste-collector.component.scss'
})
export class HomeWasteCollectorComponent implements OnInit {
    user: User | null = null;

    constructor(public layoutService: LayoutService,
                private userService: UserService,
                private locationService: LocationService,
                private collectorStateService: CollectorStateService
    ) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });

        // Obter a localização inicial
        this.locationService.getCurrentLocation().then((position) => {
            const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            // Atualizar o estado global com a localização inicial
            this.collectorStateService.setLocation(location);

            // Iniciar monitoramento se for WasteCollector
            // if (this.user.role === UserRole.WASTE_COLLECTOR) {
            //     this.collectorStateService.startCollection();
            // }
        });
    }

//     TODO talvez chamar a qui o service de location ??? inicia aqui e ja sta com a localização no mapa

}
