import { Component } from '@angular/core';
import {CardModule} from "primeng/card";

@Component({
  selector: 'app-resident',
  standalone: true,
    imports: [
        CardModule
    ],
  templateUrl: './resident.component.html',
  styleUrl: './resident.component.scss'
})
export class ResidentComponent {

}
