import { Component } from '@angular/core';
import {CollectFormComponent} from "../../../shared-components/collect-form/collect-form.component";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";

@Component({
  selector: 'app-new-collect',
  standalone: true,
    imports: [
        CollectFormComponent,
        UserFormComponent
    ],
  templateUrl: './new-collect.component.html',
  styleUrl: './new-collect.component.scss'
})
export class NewCollectComponent {

}
