import { Component } from '@angular/core';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ButtonLargerGreenComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private router: Router) {}

  navigateResident() {
    this.router.navigate(['register/resident']);
  }

  navigateWasteCollector() {
    this.router.navigate(['register/waste-collector']);
  }
}
