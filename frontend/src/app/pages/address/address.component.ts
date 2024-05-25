import { Component } from '@angular/core';
// import { AddressCardComponent } from '../../components/address-card/address-card.component';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { UserRole } from '../../core/types/user-role.type';
import { FormularyService } from '../../core/services/formulary.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from '../../core/services/address.service';
import { Address } from '../../core/types/address.type';
import { FormularyGenericService } from '../../core/services/formulary-generic.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ButtonLargerGreenComponent, AddressFormComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss',
})
export class AddressComponent {
  formModeUpdate: boolean = false;
  userType: UserRole = UserRole.RESIDENT;

  constructor(
    // private formularyGenericService: FormularyGenericService,
    private formularyService: FormularyService,
    private userService: UserService,
    private addressService: AddressService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  registerNewAddress() {
    // const formToRegister = this.formularyGenericService.getForm('addressForm');
    const formToRegister = this.formularyService.getRegister();

    if (formToRegister?.valid) {
      const newAddress = formToRegister.getRawValue() as Address;

      console.log('newAddress', newAddress);
      console.log('id do user logado', this.userService.getUserLoggedId());

      this.addressService
        .createAddress(this.userService.getUserLoggedId(), newAddress)
        .subscribe({
          next: (value) => {
            this.toastrService.success('Endereço cadastrado com com sucesso');
            console.log('Cadastro realizado com sucesso', value);
            this.router.navigate(['/user']);
          },
          error: (err) => {
            console.log('Erro ao realizar cadastro', err);
            this.toastrService.error('Erro ao realizar cadastro', err?.message);
          },
        });
    }
  }
}
