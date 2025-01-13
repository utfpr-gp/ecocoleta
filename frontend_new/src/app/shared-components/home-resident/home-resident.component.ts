import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";
import {RouterLink} from "@angular/router";

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
export class HomeResidentComponent {

}
