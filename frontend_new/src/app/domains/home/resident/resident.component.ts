import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {MapComponent} from "../../../shared_components/map/map.component";

@Component({
  selector: 'app-resident',
  standalone: true,
    imports: [
        CardModule,
        MapComponent
    ],
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss'
})
export class ResidentComponent {

}
