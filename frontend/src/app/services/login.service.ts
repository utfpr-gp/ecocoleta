import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../core/types/login-response.type';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiUrl: string = `${environment.API}/user`;

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

  //TODO tratamento de erro mais robusto
  login(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/login', { email, password })
      .pipe(
        tap((value) => {
          const token = value.token;
          if (token) {
            //setando token no sessionStorage
            this.setToken(token);

            // this.router.navigate(['/user']);
          }
          // } else {
          //   this.toastService.error('Token não recebido do servidor');
          // }
          // sessionStorage.setItem('auth-token', value.token);
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

  signupWasteCollector(
    name: string,
    email: string,
    password: string,
    phone: string
    // cpf: string,
    // picture: string
  ) {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/waste-collector', {
        name,
        email,
        password,
        phone,
        role: 'WASTE_COLLECTOR',
        //TODO corrigir camoos de cpf e picture
        cpf: '12345678901',
        picture: 'uri/picture/123456',
      })
      .pipe(
        tap((value) => {
          const token = value.token;
          if (token) {
            //setando token no sessionStorage
            this.setToken(token);
          }
          // sessionStorage.setItem('auth-token', value.token);
          // sessionStorage.setItem("username", value.name)
        })
      );
  }

  //TODO metodo logout, remove token da sesão e redireciona para a tela de login

  setToken(token: string) {
    sessionStorage.setItem('auth-token', token);
  }

  getToken() {
    return sessionStorage.getItem('auth-token');
  }

  existsToken() {
    return !!sessionStorage.getItem('auth-token');
    //Se o valor for null, undefined, 0, NaN, "" (string vazia) ou false, o resultado será false. Caso contrário, o resultado será true.
  }

  removeToken() {
    sessionStorage.removeItem('auth-token');
  }
}
