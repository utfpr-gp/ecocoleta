import { Component } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormBaseComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  formModeUpdate: boolean = true;

  constructor() {}

  async updateUser() {}
}
