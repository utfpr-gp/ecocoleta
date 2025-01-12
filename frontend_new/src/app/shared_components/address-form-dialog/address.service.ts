import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Address} from '../../core/types/address.type';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    private apiUrlMyAcountAddress: string = `${environment.API}/myaccount`;

    constructor(private httpClient: HttpClient) {
    }

    //TODO ao criar e atualizar fazer captura do long lat

    //CREATE METHODS
    createAddress(userID: String, address: Address): Observable<Address> {
        console.log('address service log> createAddress', address); //TODO apagar apos teste

        return this.httpClient.post<Address>(
            `${this.apiUrlMyAcountAddress}/${userID}/addresses`,
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
    getAllAddressByUserId(userID: string): Observable<Address[]> {
        console.log('address service log> getAddressById', userID); //TODO apagar apos teste

        return this.httpClient.get<Address[]>(
            `${this.apiUrlMyAcountAddress}/${userID}/addresses`
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

    // Método para buscar um endereço específico
    getOneAddressByUserIdAndAddressId(userId: string, addressId: string): Observable<Address> {
        console.log(
            'address service log> getOneAddressByUserIdAndAddressId',
            userId,
            addressId
        ); // TODO apagar após teste

        return this.httpClient.get<Address>(
            `${this.apiUrlMyAcountAddress}/${userId}/addresses/${addressId}`
        )
            .pipe(
                tap((address: Address) => {
                    console.log(
                        'address service log retorno tap> get adress by id',
                        address
                    ); //TODO apagar apos teste
                })
            );
    }

    //UPDATE METHODS
    updateAddress(userId: string, address: Address): Observable<Address> {
        console.log('address service log> updateAddress', address); //TODO apagar apos teste

        return this.httpClient
            .put<Address>(`${this.apiUrlMyAcountAddress}/${userId}/addresses`, address)
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
    deleteAddress(userId: string, addressId: string): Observable<void> {
        console.log('address service log> deleteAddress', userId, 'addressID', addressId); // TODO apagar após teste

        return this.httpClient.delete<void>(`${this.apiUrlMyAcountAddress}/${userId}/addresses/${addressId}`)
            .pipe(
                tap(() => {
                    console.log(`Address with ID ${addressId} for user ${userId} deleted successfully`); // TODO apagar após teste
                })
            );
    }

}
