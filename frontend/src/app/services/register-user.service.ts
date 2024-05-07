import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginResponse } from '../core/types/login-response.type';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserService {
  apiUrl: string = `${environment.API}/user`;

  constructor(private httpClient: HttpClient) {}
  //TODO tratamento de erro mais robusto
  //TODO fazer tipagem do retorno de cadastro> mudar o back para trazer o token-auth
  registerUserResident(
    userName: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Observable<any> {
    console.log('registerUserResident', email, password, userName, phoneNumber);
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/resident', {
        name: userName,
        email: email,
        password: password,
        phone: phoneNumber,
        role: 'RESIDENT',
      })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          // sessionStorage.setItem("username", value.name)
        }),
        catchError((error) => {
          // Aqui você pode tratar o erro como preferir.
          // Por exemplo, você pode registrar o erro ou notificar o usuário.
          console.error(error.message);
          // Propague o erro para que o código que chama este método possa lidar com ele.
          return throwError(error);
        })
      );
  }
}
