import { Component, OnInit } from '@angular/core';
import { AddressCardComponent } from '../../components/address-card/address-card.component';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { Router } from '@angular/router';
import { AddressService } from '../../core/services/address.service';
import { UserService } from '../../core/services/user.service';
import { Address } from '../../core/types/address.type';
import { UserRole } from '../../core/types/user-role.type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [AddressCardComponent, ButtonLargerGreenComponent],
  templateUrl: './address-list.component.html',
  styleUrl: './address-list.component.scss',
})
export class AddressListComponent implements OnInit {
  addresses: Address[] = [];
  userType: UserRole = UserRole.RESIDENT;
  canAddAddress: boolean = true;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private userService: UserService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const userId = this.userService.getUserLoggedId();
    this.userType = this.userService.returnUserRole();
    this.verifyCanAddAddress();

    console.log('Tipo de usuário logado:', this.userType); // TODO: Remover após teste
    console.log('ID do usuário logado:', userId); // TODO: Remover após teste

    this.addressService.getAllAddressByUserId(userId).subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        console.log('Lista de endereços:', this.addresses); // TODO: Remover após teste
      },
      error: (err) => {
        console.error('Erro ao buscar endereços:', err);
      },
    });
  }

  verifyCanAddAddress() {
    if (
      this.userType === UserRole.WASTE_COLLECTOR &&
      this.addresses.length > 0
    ) {
      this.canAddAddress = false;
    }
  }

  navigateRegisterNewAddress() {
    this.router.navigate(['address']);
  }

  handleDeleteAddress(addressId: number) {
    const userId = this.userService.getUserLoggedId();
    this.addressService.deleteAddress(userId, addressId).subscribe({
      next: () => {
        // this.addresses = this.addresses.filter(address => address.id !== addressId);
        this.verifyCanAddAddress();
        this.toastrService.success('Endereço deletado com sucesso');
      },
      error: (err) => {
        this.toastrService.error('Erro ao deletar endereço', err?.message);
        console.error('Erro ao deletar endereço:', err); //TODO   Remover após teste
      },
    });
  }

  //TODO finalizar update de address
  handleUpdateAddress(addressId: number) {
    // this.router.navigate(['address', addressId]);
  }
}
