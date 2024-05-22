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
export class AddressCardComponent {
  @Input() address!: Address;
  @Output() deleteClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateClick: EventEmitter<number> = new EventEmitter<number>();

  delete() {
    this.deleteClick.emit(parseInt(this.address.id as string));
  }

  update() {
    this.updateClick.emit(parseInt(this.address.id as string));
  }
}
