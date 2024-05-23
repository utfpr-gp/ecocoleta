import { Component, OnInit } from '@angular/core';
import { Address } from '../../core/types/address.type';
import { FormularyService } from '../../core/services/formulary.service';
import { UserRole } from '../../core/types/user-role.type';
import { UserService } from '../../core/services/user.service';
import { AddressService } from '../../core/services/address.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { AddressStateService } from '../../core/services/address-state.service';
import { FormGroup } from '@angular/forms';
import { FormularyGenericService } from '../../core/services/formulary-generic.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address-update',
  standalone: true,
  imports: [AddressFormComponent],
  templateUrl: './address-update.component.html',
  styleUrl: './address-update.component.scss',
})
export class AddressUpdateComponent implements OnInit {
  // paramsRoute: any;
  // userType: UserRole = UserRole.RESIDENT;
  formModeUpdate: boolean = true;
  addressId!: number | string;
  address!: Address;
  formAddress!: FormGroup<any> | null;
  private addressSubscription!: Subscription;

  constructor(
    private formularyGenericService: FormularyGenericService,
    private userService: UserService,
    private addressService: AddressService,
    private addressStateService: AddressStateService,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  //TODO verificar porque esta carregando varias vezes esse componente
  ngOnInit(): void {
    // this.addressStateService.currentAddress.subscribe((address) => {
    this.addressSubscription =
      this.addressStateService.currentAddress.subscribe((address) => {
        console.log('log 1 - Endereço init:', address);
        if (address) {
          console.log('log 2 -  entoru if addres..:', address);
          this.address = address;

          this.loadForm();
          // this.formularyService.setRegister(this.address); // Supondo que você tenha um método no serviço de formulários para definir os valores do formulário
        } else {
          this.router.navigate(['/address/list']);
        }
      });
    // this.formularyGenericService.setForm('addressForm', this.formAddress);
  }

  loadForm() {
    console.log('log 3 - load form vai carregar!:');
    this.formAddress = this.formularyGenericService.getForm('formAddress');
    console.log('log 4 - form caregou :', this.formAddress);

    // this.formAddress?.patchValue(this.address);

    // this.formAddress?.patchValue({
    //   id: this.address?.id,
    //   cep: this.address.cep,
    //   name: this.address.name,
    //   street: this.address.street,
    //   number: this.address.number,
    //   neighborhood: this.address.neighborhood,
    //   city: this.address.city,
    // });

    if (this.formAddress) {
      this.formAddress.patchValue({
        id: this.address.id,
        cep: this.address.cep,
        name: this.address.name,
        street: this.address.street,
        number: this.address.number,
        neighborhood: this.address.neighborhood,
        city: this.address.city,
      });
    } else {
      console.error('Formulário não foi inicializado corretamente.');
    }

    console.log('log 5 - form patchValue:', this.formAddress);
    // this.formularyGenericService.setForm('addressForm', this.formAddress);
  }

  updateAddress() {}

  // getAllAddressByUserId() {}
}
