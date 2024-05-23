import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Address } from '../../core/types/address.type';

@Component({
  selector: 'app-address-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
})
// export class AddressCardComponent {
//   @Input() address!: Address;
//   @Output() deleteClick: EventEmitter<number> = new EventEmitter<number>();
//   @Output() updateClick: EventEmitter<number> = new EventEmitter<number>();

//   delete() {
//     this.deleteClick.emit(this.address.id);
//   }

//   update() {
//     console.log('update button clicked!: addres id:', this.address.id);
//     this.updateClick.emit(this.address.id);
//   }
// }
export class AddressCardComponent {
  @Input() address!: Address;
  @Output() deleteClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateClick: EventEmitter<Address> = new EventEmitter<Address>();

  delete() {
    this.deleteClick.emit(this.address.id);
  }

  update() {
    console.log('update button clicked!: addres id:', this.address.id);
    this.updateClick.emit(this.address);
  }
}
