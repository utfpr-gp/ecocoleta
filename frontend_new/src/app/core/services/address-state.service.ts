import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Address } from '../types/address.type';

@Injectable({
  providedIn: 'root',
})
export class AddressStateService {
  private addressSource = new BehaviorSubject<Address | null>(null);
  currentAddress = this.addressSource.asObservable();

  setAddress(address: Address) {
    console.log('Endereço state setado:', address);
    this.addressSource.next(address);
  }

  // clearAddress() {
  //   console.log('Endereço state limpo');
  //   this.addressSource.next(null);
  // }
}
