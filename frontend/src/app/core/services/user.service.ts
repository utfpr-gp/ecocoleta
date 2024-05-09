import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User, WasteCollector } from '../types/user.type';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = `${environment.API}/user`;

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {}

  getUser(): Observable<User> {
    // return this.httpClient.get<User>(`${this.apiUrl}/user`);
    return this.httpClient.get<User>(`${this.apiUrl}/hello`); // TODO Alterado para testar a API
  }

  createUserWasteCollector(user: WasteCollector): Observable<WasteCollector> {
    //Add role to user
    user.role = 'WASTE_COLLECTOR';

    //TODO refactor this, esta mandando o bjeto inteiro com emailchack etc, api nã oesta aceitando...
    console.log('createUserWasteCollector', user); //TODO apagar apos teste

    return this.httpClient
      .post<WasteCollector>(`${this.apiUrl}/waste-collector`, user)
      .pipe(
        tap((value) => {
          const token = value.token;
          if (token) {
            //setando token no sessionStorage
            this.loginService.setToken(token);
          }
        })
      );
  }
}
