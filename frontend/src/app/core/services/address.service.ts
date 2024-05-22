import { HttpClient, HttpParams } from '@angular/common/http';
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
  getAllAddressByUserId(userID: number): Observable<Address[]> {
    console.log('address service log> getAddressById', userID); //TODO apagar apos teste

    return this.httpClient.get<Address[]>(
      `${this.apiUrlMyAcountAddress}/${userID}`
    );
    // .pipe(
    //   tap((address: Address[]) => {
    //     console.log(
    //       'address service log retorno tap> getAddressById',
    //       address
    //     ); //TODO apagar apos teste
    //   })
    // );
  }

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
  deleteAddress(userId: number, addressId: number): Observable<Address> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('addressId', addressId);

    console.log(
      'address service log> deleteAddress',
      userId,
      'addressID',
      addressId
    ); //TODO apagar apos teste

    return this.httpClient
      .delete<Address>(`${this.apiUrlMyAcountAddress}/`, { params })
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
