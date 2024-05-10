import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../types/user.type';
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

  createUserWasteCollector(user: User): Observable<User> {
    //Add role to user
    user.role = 'WASTE_COLLECTOR';

    //TODO refactor this, esta mandando o bjeto inteiro com emailchack etc, api nã oesta aceitando...
    console.log('user servic log> createUserWasteCollector', user); //TODO apagar apos teste

    return this.httpClient
      .post<User>(`${this.apiUrl}/waste-collector`, user)
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

  createUserResident(user: User): Observable<User> {
    //Add role to user
    user.role = 'RESIDENT';

    console.log('user servic log> createUserResident', user); //TODO apagar apos teste

    return this.httpClient.post<User>(`${this.apiUrl}/resident`, user).pipe(
      tap((value) => {
        // const token = value.token;
        if (value.token) {
          //setando token no sessionStorage
          this.loginService.setToken(value.token);
        }
      })
    );
  }
}
