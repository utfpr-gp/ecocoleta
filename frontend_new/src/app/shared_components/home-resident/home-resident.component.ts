import { Component } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-home-resident',
  standalone: true,
    imports: [
        ButtonModule,
        MapComponent
    ],
  templateUrl: './home-resident.component.html',
  styleUrl: './home-resident.component.scss'
})
export class HomeResidentComponent {

}
