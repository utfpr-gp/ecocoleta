import { Component } from '@angular/core';
import { AddressCardComponent } from '../../components/address-card/address-card.component';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [AddressCardComponent, ButtonLargerGreenComponent],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss',
})
export class AddressListComponent {
  constructor(private router: Router) {}

  navigateRegisterNewAddress() {
    this.router.navigate(['address']);
  }
}
