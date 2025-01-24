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

    //CREATE METHODS
    createAddress(userID: String, address: Address): Observable<Address> {
        return this.httpClient.post<Address>(
            `${this.apiUrlMyAcountAddress}/${userID}/addresses`,
            address
        );
    }

    //GET METHODS
    getAllAddressByUserId(userID: string): Observable<Address[]> {
        return this.httpClient.get<Address[]>(
            `${this.apiUrlMyAcountAddress}/${userID}/addresses`
        );
    }

    //buscar um endereço específico
    getOneAddressByUserIdAndAddressId(userId: string, addressId: string): Observable<Address> {
        return this.httpClient.get<Address>(
            `${this.apiUrlMyAcountAddress}/${userId}/addresses/${addressId}`
        );
    }

    //UPDATE METHODS
    updateAddress(userId: string, address: Address): Observable<Address> {
        return this.httpClient
            .put<Address>(`${this.apiUrlMyAcountAddress}/${userId}/addresses`, address);
    }

    //DELETE METHODS
    deleteAddress(userId: string, addressId: string): Observable<void> {
        return this.httpClient.delete<void>(`${this.apiUrlMyAcountAddress}/${userId}/addresses/${addressId}`);
    }

}
