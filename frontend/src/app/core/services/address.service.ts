import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../types/address.type';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  apiUrlMyAcountAddress: string = `${environment.API}/myaccount/address`;

  constructor(private httpClient: HttpClient) {}

  //CREATE METHODS
  createAddress(userID: number, address: Address): Observable<Address> {
    console.log('address service log> createAddress', address); //TODO apagar apos teste

    return this.httpClient.post<Address>(
      `${this.apiUrlMyAcountAddress}/${userID}`,
      address
    );
    // .pipe
    // // tap((address: Address) => {
    // //   console.log(
    // //     'address service log retorno tap> createAddress',
    // //     address
    // //   ); //TODO apagar apos teste
    // // })
    // ();
  }

  //GET METHODS
  getAddressById(id: string): Observable<Address> {
    console.log('address service log> getAddressById', id); //TODO apagar apos teste

    return this.httpClient
      .get<Address>(`${this.apiUrlMyAcountAddress}/${id}`)
      .pipe(
        tap((address: Address) => {
          console.log(
            'address service log retorno tap> getAddressById',
            address
          ); //TODO apagar apos teste
        })
      );
  }

  //TODO refatorar esse metodo tanto front e back não existe
  // getAllAddressByUserId(userId: string): Observable<Address[]> {
  //   console.log('address service log> getAllAddressByUserId', userId); //TODO apagar apos teste

  //   return this.httpClient
  //     .get<Address[]>(`${this.apiUrlMyAcountAddress}/user/${userId}`)
  //     .pipe(
  //       tap((address: Address[]) => {
  //         console.log(
  //           'address service log retorno tap> getAllAddressByUserId',
  //           address
  //         ); //TODO apagar apos teste
  //       })
  //     );
  // }

  //UPDATE METHODS
  updateAddress(address: Address): Observable<Address> {
    console.log('address service log> updateAddress', address); //TODO apagar apos teste

    return this.httpClient
      .put<Address>(`${this.apiUrlMyAcountAddress}/${address.id}`, address)
      .pipe(
        tap((address: Address) => {
          console.log(
            'address service log retorno tap> updateAddress',
            address
          ); //TODO apagar apos teste
        })
      );
  }

  //DELETE METHODS
  deleteAddress(id: string): Observable<Address> {
    console.log('address service log> deleteAddress', id); //TODO apagar apos teste

    return this.httpClient
      .delete<Address>(`${this.apiUrlMyAcountAddress}/${id}`)
      .pipe(
        tap((address: Address) => {
          console.log(
            'address service log retorno tap> deleteAddress',
            address
          ); //TODO apagar apos teste
        })
      );
  }
}
