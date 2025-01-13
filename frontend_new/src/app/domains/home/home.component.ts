import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {MapComponent} from "../../shared_components/map/map.component";

@Component({
  selector: 'app-resident',
  standalone: true,
    imports: [
        CardModule,
        MapComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
