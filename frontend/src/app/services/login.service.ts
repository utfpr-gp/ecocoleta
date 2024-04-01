import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiUrl: string = `${environment.API}auth`;

  constructor(private httpClient: HttpClient) {}

  /* login(email: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/login', { email, password })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          // sessionStorage.setItem("username", value.name)
        })
      );
  } */

  //TODO tratament ode erro mais robusto
  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/login', { email, password })
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

  signup(name: string, email: string, password: string) {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/register', { name, email, password })
      .pipe(
        tap((value) => {
          sessionStorage.setItem('auth-token', value.token);
          // sessionStorage.setItem("username", value.name)
        })
      );
  }
}
