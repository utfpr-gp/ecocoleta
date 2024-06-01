import { Component } from '@angular/core';
import { CollectFormComponent } from '../../components/collect-form/collect-form.component';

@Component({
  selector: 'app-collect',
  standalone: true,
  imports: [CollectFormComponent],
  templateUrl: './collect.component.html',
  styleUrl: './collect.component.scss',
})
export class CollectComponent {}
