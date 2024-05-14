import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../types/login-response.type';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiUrl: string = `${environment.API}/auth`;

  constructor(private httpClient: HttpClient) {}

  //TODO tratamento de erro mais robusto
  login(email: string, password: string): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(this.apiUrl + '/login', { email, password })
      .pipe(
        tap((value) => {
          if (value.token) {
            //setando token no sessionStorage
            this.setToken(value.token);
          }
        })
        // catchError((error) => {
        //   // Aqui você pode tratar o erro como preferir.
        //   // Por exemplo, você pode registrar o erro ou notificar o usuário.
        //   console.error(error.message);
        //   // Propague o erro para que o código que chama este método possa lidar com ele.
        //   return throwError(error);
        // })
      );
  }

  //TODO metodo logout, remove token da sesão e redireciona para a tela de login

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY) ?? '';
  }

  existsToken() {
    return !!this.getToken();
    //Se o valor for null, undefined, 0, NaN, "" (string vazia) ou false, o resultado será false. Caso contrário, o resultado será true.
  }

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
